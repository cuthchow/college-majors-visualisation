let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes

const categories = ['Engineering', 'Business', 'Physical Sciences', 'Law & Public Policy', 'Computers & Mathematics', 'Agriculture & Natural Resources',
'Industrial Arts & Consumer Services','Arts', 'Health','Social Science', 'Biology & Life Science','Education','Humanities & Liberal Arts',
'Psychology & Social Work','Communications & Journalism','Interdisciplinary']

const categoriesXY = {'Engineering': [0, 400],
                        'Business': [0, 600],
                        'Physical Sciences': [0, 800],
                        'Law & Public Policy': [0, 200],
                        'Computers & Mathematics': [200, 400],
                        'Agriculture & Natural Resources': [200, 600],
                        'Industrial Arts & Consumer Services': [200, 800],
                        'Arts': [200, 200],
                        'Health': [400, 400],
                        'Social Science': [400, 600],
                        'Biology & Life Science': [400, 800],
                        'Education': [400, 200],
                        'Humanities & Liberal Arts': [600, 400],
                        'Psychology & Social Work': [600, 600],
                        'Communications & Journalism': [600, 800],
                        'Interdisciplinary': [600, 200]}

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
    salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [5, 35])
    salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.left, margin.left + width])
    salaryYScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.top + height, margin.top])
    categoryColorScale = d3.scaleOrdinal(categories, d3.schemeSet3)
    shareWomenXScale = d3.scaleLinear(d3.extent(dataset, d => d.ShareWomen), [margin.left, margin.left + width])
    enrollmentScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [margin.left, margin.left + width])
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
        .force('charge', d3.forceManyBody().strength([2]))
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0]+ 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1]))
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
        .transition('scatterplot').duration(500)
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
        .transition('small-multiples-categories').duration(500)
        .attr('r', d => salarySizeScale(d.Median))
        .attr('fill', d => categoryColorScale(d.Category))

    //Reheat simulation and restart
    simulation.alpha([1]).restart()

    svg.selectAll('text')
        .data(categories).enter()
        .append('text')
            .text(d => d.value)
            .attr('x', d => categoriesXY[d.value][0] + 200)
            .attr('y', d => categoriesXY[d.value][1])
    // simulation.restart()
}

function draw3(){

    simulation
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0]+ 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1]))

    simulation.alpha(1).restart()

    let svg = d3.select('#vis').select('svg')
    svg.selectAll('g').transition().remove()
    svg.selectAll('text').transition().remove()

    svg.selectAll('circle')
        .transition('small-multiples-gender').duration(500).delay((d, i) => i * 10)
        .attr('fill', colorByGender)
        .attr('r', d => salarySizeScale(d.Median))
}

function colorByGender(d, i){
    if (d.ShareWomen < 0.4){
        return 'blue'
    } else if (d.ShareWomen > 0.6) {
        return 'red'
    } else {
        return 'grey'
    }
}

function draw4(){
    simulation.stop()
    
    let svg = d3.select("#vis").select("svg")
    svg.selectAll('g').attr('opacity', 0).transition().remove()
    svg.selectAll('text').transition().attr('opacity', 0).remove()

    let xAxis = d3.axisBottom(shareWomenXScale)
    let yAxis = d3.axisLeft(salaryYScale)

    svg.selectAll('circle')
        .transition('gender-scatter').duration(1000)
        .attr('cx', d => shareWomenXScale(d.ShareWomen))
        .attr('cy', d => 1000 - salaryXScale(d.Median))
        .attr('fill', colorByGender)
        .attr('r', 10)

    svg.append('g')
        .call(xAxis)
            .transition(500)
            .attr('transform', `translate(0, ${height})`)
    
    svg.append('g')
        .call(yAxis)
            .transition(500)
            .attr('transform', `translate(${margin.left - 20}, 0)`)

}

function draw5(){
    let svg = d3.select('#vis').select('svg')
    svg.selectAll('g').transition().remove()
    svg.selectAll('text').transition().remove()

    simulation  
        .force('forceX', d3.forceX(d => enrollmentScale(d.Total)))
        .force('forceY', d3.forceY(500))

    simulation.alpha(1).restart()

    let xAxis = d3.axisBottom(enrollmentScale)
    svg.append('g').call(xAxis).transition(500).attr('transform', 'translate(0, 700)')

}


//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    draw1,
    draw2,
    draw3,
    draw4, 
    draw5
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