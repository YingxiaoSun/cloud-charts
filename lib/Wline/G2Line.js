'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Brush = require('@antv/g2-brush');

var _g2Brush2 = _interopRequireDefault(_g2Brush);

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('../common/common');

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _autoTimeMask = require('../common/autoTimeMask');

var _autoTimeMask2 = _interopRequireDefault(_autoTimeMask);

var _rectAutoTickCount = require('../common/rectAutoTickCount');

var _rectAutoTickCount2 = _interopRequireDefault(_rectAutoTickCount);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

var _ResetButton = require('../common/ResetButton');

var _ResetButton2 = _interopRequireDefault(_ResetButton);

var _drawLine = require('../common/drawLine');

var _drawLine2 = _interopRequireDefault(_drawLine);

require('./G2Line.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Line', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.category_12,
      areaColors: [],
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'time', // 默认为线性
        mask: 'auto', // 上述type为time时，此字段生效
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false,
        max: null,
        min: null
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      area: false,
      stack: false, // 仅Area有效
      spline: false,
      grid: false,
      symbol: false,
      zoom: false,
      label: false,
      step: null
      // TODO
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, this.defaultConfig, config);

    // // TODO 处理padding
    // let defaultPaddingTop = defaultConfig.padding[0];
    // let defaultPaddingRight = defaultConfig.padding[1];
    // const defaultPaddingBottom = defaultConfig.padding[2];
    // const defaultPaddingLeft = defaultConfig.padding[3];
    // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
    //   defaultPaddingRight = 44;
    // }
    // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
    //   defaultPaddingTop = 16;
    // }
    return _extends({}, props, {
      // padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        defs['y' + yIndex] = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis);
    }

    (0, _autoTimeMask2.default)(defs, this.rawData);

    (0, _rectAutoTickCount2.default)(chart, config, defs, false);

    chart.source(data, defs);

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var yAxisConfig = {
          line: {
            stroke: (0, _common.getDataIndexColor)(config.colors, _this.rawData, yIndex) || _index2.default['widgets-axis-line']
          }
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
        }

        _rectYAxis2.default.call(_this, chart, _extends({}, config, { yAxis: axis }), 'y' + yIndex, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      _rectYAxis2.default.call(this, chart, config);
    }

    // 设置图例
    _rectLegend2.default.call(this, chart, config, null, false, 'type');

    _legendFilter2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        (0, _drawLine2.default)(chart, config, 'y' + yIndex);
      });
    } else {
      (0, _drawLine2.default)(chart, config);
    }

    chart.render();

    // 拖拽缩放
    if (config.zoom) {
      var button = new _ResetButton2.default(chart, this.language);
      this.resetButton = button;

      this.brush = new _g2Brush2.default({
        canvas: chart.get('canvas'),
        chart: chart,
        type: 'X',
        onBrushstart: function onBrushstart(startPoint) {
          chart.hideTooltip();
          chart.emit('zoom:start', startPoint);
        },

        onBrushmove: function onBrushmove() {
          chart.hideTooltip();
          button.show(_this.language);
        },
        onBrushend: function onBrushend(ev) {
          _this.brush.container.clear(); // clear the brush
          var type = _this.brush.type;
          var xScale = _this.brush.xScale;
          var yScale = _this.brush.yScale;
          // filter data

          if (type === 'X') {
            xScale && chart.filter(xScale.field, function (val) {
              return ev[xScale.field].indexOf(val) > -1;
            });
          } else if (type === 'Y') {
            yScale && chart.filter(yScale.field, function (val) {
              return ev[yScale.field].indexOf(val) > -1;
            });
          } else {
            xScale && chart.filter(xScale.field, function (val) {
              return ev[xScale.field].indexOf(val) > -1;
            });
            yScale && chart.filter(yScale.field, function (val) {
              return ev[yScale.field].indexOf(val) > -1;
            });
          }
          chart.repaint();

          chart.emit('zoom:end', ev);
        }
      });
    }
  },
  changeData: function changeData(chart, config, data) {
    chart.changeData(data);

    // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
    if (config.zoom && this.brush) {
      this.brush.xScale = chart.getXScale();
      this.brush.yScale = chart.getYScales()[0];
    }
  },
  destroy: function destroy() {
    // 销毁时需要额外销毁缩放重置按钮
    if (this.brush) {
      this.brush.destroy();
    }
    if (this.resetButton) {
      this.resetButton.destroy();
    }
  }
}));