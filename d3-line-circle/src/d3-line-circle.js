import { Init, d3Remove, makecomma, d3, svgCheck} from '@saramin/ui-d3-helper'
import CLASS from '@saramin/ui-d3-selector';

const LineCircle = function(...arg) {
	const plugin = new Init(arg);
	let targetNodes = this.targetNodes = Init.setTarget(plugin),
		dataContainer = this.dataContainer = Init.setData(plugin),
		options = this.options = Init.setOptions(plugin, {
			w: 838,
			h: 280,
			mTop: 40,
			mRight: 20,
			mBottom: 20,
			mLeft: 40,
			ticks: 7,
			xAxisX: -10,
			dataRangeMin: 0,
			dataRangeMax: 100,
			circleNormal: 30,
			circlePoint: 40,
			circleZero: 4,
			labelCurreny: '만원',
			scoreDx:'-1.2em',
			scoreDy:'0.2em',
			currencyDx: '-1em',
			currencyDy: '1.7em'
		}),
		instances = this.instances = [];

	Array.from(targetNodes).forEach(exec);

	function exec(el, i) {
		if(svgCheck.status) {

			// data reformat
			let data = dataContainer[i],
				reformatData = [],
				keys = Object.keys(data[0][0]);

			// data 형태 변환
			data[0].forEach((d, i) => reformatData[i] = keys.map(function(key) { return {x: key, y: d[key]} }) );

			// data min, max 값
			const maxDataArray = data[0].reduce((acc, item) => {
				Object.keys(item).forEach(key => acc.push(item[key]));
				return acc;
			}, []);

			let maxValue = Math.max(...maxDataArray);


			// svg dom remove
			d3Remove(el);

			const width = options.w - (options.mRight + options.mLeft),
				height = options.h - (options.mTop + options.mBottom);


			// set the ranges
			const x = d3.scaleBand().range([0, width]).padding(0.2);
			const y = d3.scaleLinear().range([height, 0]);
			x.domain(keys);
			y.domain([options.dataRangeMin, maxValue > options.dataRangeMax ? options.dataRangeMax = maxValue + 1000 : options.dataRangeMax]);


			// svg 생성

			const g = d3.select(el).append('svg')
				.classed(`${CLASS.lineChartClass}`, true)
				.attr('width', width + options.mLeft + options.mLeft)
				.attr('height', height + options.mTop + options.mBottom )
				.append('g')
				.attr('transform', 'translate(0,' + options.mTop + ')');



			// Axis 선 만들기
			const xAxis = d3.axisBottom(x);
			const yAxis = d3.axisLeft(y).ticks(options.ticks).tickSize(-width);

			const customXAxis = g => {
				g.call(xAxis);
				g.selectAll('line').remove();
				g.selectAll('text').classed(`${CLASS.lineChartAxisTextX}`,true);
			}

			const customYAxis = g => {
				g.call(yAxis);
				g.selectAll('.tick line')
					.classed('tick_y', true);
				g.selectAll('.tick text')
					.remove();
			}

			const endTxt = () => {
				g.selectAll('.circle_txt').transition().delay(100).style('opacity','1');
			}

			g.append('g')
				.attr('transform', 'translate('+ options.xAxisX +',' + height + ')')
				.classed(`${CLASS.xAxis}`,true)
				.call(customXAxis);

			g.append('g')
				.classed(`${CLASS.yAxis}`,true)
				.call(customYAxis);

			const line = d3.line()
				.curve(d3.curveLinear)
				.x(d => x(d.x))
				.y(d => y(d.y));

			const lineG = g.append('g')
				.classed(`${CLASS.lineChartLine}`, true)
				.selectAll('g')
				.data(reformatData)
				.enter()
				.append('g')
				.append('path')
				.attr('class', (d, i) => `${CLASS.lineChartPath} ${CLASS.lineChartPath}`+ (i+1))
				.attr('d', line)
				.attr('transform','translate(36, 0)');


			const dotG = g.selectAll(`${CLASS.lineChartWrapDot}`)
				.data(reformatData)
				.enter()
				.append('g')
				.attr('class', (d, i) => `${CLASS.lineChartWrapDot} ${CLASS.lineChartWrapDot}_` + (i+1))
				.attr('transform','translate(36, 0)');

			const dots = dotG.selectAll(`${CLASS.lineChartDot}`)
				.data(d => d)
				.enter()
				.append('g')
				.attr('class', d => {
					if(d.y == maxValue) {
						return 'circleG max'
					}else {
						return 'circleG'
					}
				})
				.append('circle')
				.classed(`${CLASS.lineChartDot}`, true)
				.attr('cx', d => x(d.x))
				.attr('cy', d => y(d.y))
				.attr('r', 5)
				.transition()
				.duration(900)
				.delay(function(d,i){return(i*250)})
				.attr('r', (d,i) => {
					switch (true) {
						case (d.y === 0):
							return options.circleZero;
							break;
						case (i === keys.length-1):
							return options.circlePoint;
							break;
						case (d.y === !maxValue || d.y > 0):
							return options.circleNormal;
							break;
					}
				})
				.on('end', endTxt);

			const score = dotG.selectAll('.circleG')
				.append('text')
				.attr('x', d => x(d.x))
				.attr('y', d => y(d.y))
				.attr('dx', options.scoreDx)
				.attr('dy', options.scoreDy)
				.text(d => d.y > 0 ? makecomma(d.y) : ' ')
				.classed('circle_txt', true);

			const scoreCurrency = dotG.selectAll('.circleG')
				.append('text')
				.attr('x', d => x(d.x))
				.attr('y', d => y(d.y))
				.attr('dx', options.currencyDx)
				.attr('dy', options.currencyDy)
				.text(d => d.y > 0 ? options.labelCurreny : ' ')
				.classed('circle_txt circle_txt2', true);



		}else {
			el.innerHTML = '<p class="svg_not_supported">SVG를 지원하지 않는 브라우저입니다.</p>'
		}
	}
};
export default LineCircle;
