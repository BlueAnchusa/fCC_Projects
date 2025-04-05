//various constants//
let w = 720;
let h = 480;
let barWidth = w/272;

//Tooltip//
let tooltip = d3.select('.graph')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

//SVG for graph//


d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(data => {

        let gdp = data.data.map(item => item[1]);

        let dates = data.data.map(item => new Date(item[0]));

        let dateQuarter = data.data.map(function (item) {
            let quarter;
            let temp = item[0].substring(5, 7);

            if (temp === '01') {
                quarter = 'Q1';
            }
            if (temp === '04') {
                quarter = 'Q2';
            }
            if (temp === '07') {
                quarter = 'Q3';
            }
            if (temp === '10') {
                quarter = 'Q4';
            }

            return item[0].substring(0, 4) + ' ' + quarter;
        });
        
        let scaledGDP = [];

        let yScale = d3.scaleLinear()
                        .domain([0, d3.max(gdp)])
                        .range([h, 0]);

        scaledGDP = gdp.map(item => yScale(item));

        let xScale = d3.scaleTime()
                        .domain([d3.min(dates), d3.max(dates)])
                        .range([0, w]);
        
        let svg = d3.select('.graph')
            .append('svg')
            .attr('height', h + 50)
            .attr('width', w + 100)
            .style('margin','75px')
            .style('padding', '50px')
            .style('background-color', '#777777');
            
        svg.selectAll('rect')
            .data(scaledGDP)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('data-date', (d, i) => data.data[i][0])
            .attr('data-gdp', (d, i) => data.data[i][1])
            .attr('x', (d, i) => xScale(dates[i]))
            .attr('y', d => d)
            .attr('width', barWidth)
            .attr('height', d => h - d)
            .attr('transform', 'translate(60, 10)')
            .attr('index', (d, i) => i)
            .style('fill', '#3333aa')
            .on('mouseover', function (event, d) {

                let i = this.getAttribute('index');

                d3.select(this).transition()
                    .duration('0')
                    .attr('opacity', '.5');

                    
                tooltip.transition().duration('0').style('opacity', 0.9)
                .style('left', i * barWidth + 450 +'px')
                .style('top', h + 'px');

                tooltip.html(dateQuarter[i] + '<br>' + '$' + gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                    .attr('data-date', data.data[i][0]);

                })

            .on('mouseout', function () {
                d3.select(this).transition()
                    .duration('0')
                    .attr('opacity', '1')
                tooltip.transition()
                    .duration('200')
                    .style('opacity', 0)});


        let xAxis = d3.axisBottom().scale(xScale);

        let yAxis = d3.axisLeft().scale(yScale);

        svg.append('g')
        .call(yAxis)
        .attr('transform', 'translate(60, 10)')
        .attr('id', 'y-axis');

        svg.append('g')
        .call(xAxis)
        .attr('transform', 'translate(60, 490)')
        .attr('id', 'x-axis');
    })