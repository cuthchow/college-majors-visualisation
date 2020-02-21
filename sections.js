let dataset
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes

const categories = ['Engineering', 'Business', 'Physical Sciences', 'Law & Public Policy', 'Computers & Mathematics', 'Agriculture & Natural Resources',
'Industrial Arts & Consumer Services','Arts', 'Health','Social Science', 'Biology & Life Science','Education','Humanities & Liberal Arts',
'Psychology & Social Work','Communications & Journalism','Interdisciplinary']

const margin = {left: 150, top: 20, bottom: 20, right: 20}
const width = 1000 - margin.left - margin.right
const height = 1000 - margin.top - margin.bottom

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv('data/recent-grads.csv', function(d){
    return {
        Major: d.Major,
        Total: +d.Total,
        Men: +d.Men,
        Women: +d.Women,
        Median: +d.Median,
        Unemployment: +d.Unemployment_rate,
        Category: d.Major_category,
        ShareWomen: +d.ShareWomen
    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales()
    drawInitial()
})

//Create all the scales and save to global variables

function createScales(){
    salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [2, 5])
    salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.left, margin.left + width])
    categoryColorScale = d3.scaleOrdinal(categories, d3.schemeSet3)
}

function drawInitial(){
    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 1000)

    simulation = d3.forceSimulation(dataset)
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter())

    simulation.on('tick', () => {
            nodes
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
    })
                    
    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('fill', d => categoryColorScale(d.Category))
            .attr('r', 3)
            .attr('cx', (d, i) => salaryXScale(d.Median))
            .attr('cy', (d, i) => i * 5.5 + 20)
    
    nodes.append('title')
        .text(d => d.Major)

    let xAxis = d3.axisBottom(salaryXScale)
                    .ticks(4)
                    .tickSize(980)

    let xAxisGroup = svg.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(xAxis)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    svg.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
            .text((d, i) => d.Major)
            .attr('x', 150)
            .attr('y', (d, i) => i * 5.5 + 20)
            .attr('font-size', 5)
            .attr('text-anchor', 'end')
}


function draw2(){
    
}

let activationFunctions = [
    
]

let scroll = scroller()
    .container(d3.select('#graphic'))

scroll()

scroll.on('active', function(index){
    d3.selectAll('.step')
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    draw2()
    // activationFunctions[index]()

})