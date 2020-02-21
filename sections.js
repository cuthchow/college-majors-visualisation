let dataset, svg
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
    salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [5, 40])
    salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.left, margin.left + width])
    categoryColorScale = d3.scaleOrdinal(categories, d3.schemeSet3)
}



//Draws the initial stuff
//This will include all the baseline things such as the bubbles
//Initiates the force simulation, but pauses until later 

function drawInitial(){
    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 1000)

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

    simulation = d3.forceSimulation(dataset)
        .force('charge', d3.forceManyBody().strength([1]))
        .force('forceX', d3.forceX(400))
        .force('forceY', d3.forceY(400))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 2))
        .alpha([2]).alphaDecay([0.03])

    // Selection of all the circles 
    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('fill', d => categoryColorScale(d.Category))
            .attr('r', 3)
            .attr('cx', (d, i) => salaryXScale(d.Median))
            .attr('cy', (d, i) => i * 5.5 + 20)
            .attr('opacity', 0.8)
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', function (d, i){
                d3.select(this)
                    .transition().duration(100)
                    .attr('opacity', 1)
                    .attr('stroke-width', 5)
                    .attr('stroke', 'black')
            })

    svg.selectAll('circle')
        .on('mouseout', function (d, i){
            d3.select(this)
                .transition().duration(100)
                .attr('opacity', 0.8)
                .attr('stroke-width', 0)
        })
    
    nodes.append('title')
        .text(d => d.Major)

    // Define each tick of simulation
    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    // Stop the simulation until later
    simulation.stop()

    
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


//First draw function
//Need to undo the graph of both the preceding and proceeding functions

function draw1(){
    //Stop simulation
    simulation.stop()
    
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 1000)

    let xAxis = d3.axisBottom(salaryXScale)
                    .ticks(4)
                    .tickSize(980)

    let xAxisGroup = svg.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(xAxis)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
        .transition().duration(500)
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
        .transition().duration(500)
        .text((d, i) => d.Major)
        .attr('x', 150)
        .attr('y', (d, i) => i * 5.5 + 20)
        .attr('font-size', 5)
        .attr('text-anchor', 'end')
    
    svg.selectAll('circle')
        .transition().duration(500)
        .attr('fill', d => categoryColorScale(d.Category))
        .attr('r', 3)
        .attr('cx', (d, i) => salaryXScale(d.Median))
        .attr('cy', (d, i) => i * 5.5 + 20)
}


function draw2(){
    let svg = d3.select("#vis").select('svg')
    
    svg.selectAll('g').transition().remove()
    svg.selectAll('text').transition().remove()

    svg.selectAll('circle')
        .transition().duration(500)
        .attr('r', d => salarySizeScale(d.Median))

    //Reheat simulation and restart
    simulation.alpha([1]).restart()

    // simulation.restart()
}




//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    draw1,
    draw2,
    temp,
    temp
]


function temp(){

}


//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))

scroll()

scroll.on('active', function(index){
    d3.selectAll('.step')
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activationFunctions[index]()
    // activationFunctions[index]()

})