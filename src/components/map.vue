<template>
  <div class="com-contain" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axiox from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapdata: {},
    };
  },
  created() {
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unregisterCallBack("mapData");
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      // 获取中国地图的矢量数据
      // 由于我们现在获取的地图矢量数据并不是位于KOA2的后台，所以不能使用this.$http
      const ret = await axiox.get(
        "http://localhost:8999/static/map/china.json"
      );
      this.$echarts.registerMap("China", ret.data);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "China",
          top: "5%",
          buttom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        if (!this.mapdata[provinceInfo.key]) {
          const ret = await axiox.get(
            "http://localhost:8999" + provinceInfo.path
          );
          this.mapdata[provinceInfo.key] = ret.data;
          this.$echarts.registerMap(provinceInfo.key, ret.data);
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.chartInstance.setOption(changeOption);
      });
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get("map");
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 如果想在地图中显示散点的数据，我们则要给散点的图表增加一个配置，coordinateSystem: 'geo'
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: seriesArr.name,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemHeight: titleFontSize / 2,
          itemWidth: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: "China",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
};
</script>

<style lang="less" scoped>
</style>