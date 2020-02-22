let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes

const categories = ['Engineering', 'Business', 'Physical Sciences', 'Law & Public Policy', 'Computers & Mathematics', 'Agriculture & Natural Resources',
'Industrial Arts & Consumer Services','Arts', 'Health','Social Science', 'Biology & Life Science','Education','Humanities & Liberal Arts',
'Psychology & Social Work','Communications & Journalism','Interdisciplinary']

const categoriesXY = {'Engineering': [0, 400, 57382, 23.9],
                        'Business': [0, 600, 43538, 48.3],
                        'Physical Sciences': [0, 800, 41890, 50.9],
                        'Law & Public Policy': [0, 200, 42200, 48.3],
                        'Computers & Mathematics': [200, 400, 42745, 31.2],
                        'Agriculture & Natural Resources': [200, 600, 36900, 40.5],
                        'Industrial Arts & Consumer Services': [200, 800, 36342, 35.0],
                        'Arts': [200, 200, 33062, 60.4],
                        'Health': [400, 400, 36825, 79.5],
                        'Social Science': [400, 600, 37344, 55.4],
                        'Biology & Life Science': [400, 800, 36421, 58.7],
                        'Education': [400, 200, 32350, 74.9],
                        'Humanities & Liberal Arts': [600, 400, 31913, 63.2],
                        'Psychology & Social Work': [600, 600, 30100, 79.4],
                        'Communications & Journalism': [600, 800, 34500, 65.9],
                        'Interdisciplinary': [600, 200, 35000, 77.1]}

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
    salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.left, margin.left + width + 200])
    salaryYScale = d3.scaleLinear([20000, 110000], [margin.top + height, margin.top])
    categoryColorScale = d3.scaleOrdinal(categories, d3.schemeSet3)
    shareWomenXScale = d3.scaleLinear(d3.extent(dataset, d => d.ShareWomen), [margin.left, margin.left + width])
    enrollmentScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [margin.left + 120, margin.left + width - 50])
    enrollmentSizeScale = d3.scaleLinear(d3.extent(dataset, d=> d.Total), [10,60])
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
            .attr('fill', 'black')
            .attr('r', 3)
            .attr('cx', (d, i) => salaryXScale(d.Median))
            .attr('cy', (d, i) => i * 5.5 + 20)
            .attr('opacity', 0.8)
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`<strong>Major:</strong> ${d.Major[0] + d.Major.slice(1,).toLowerCase()} 
                <br> <strong>Median Salary:</strong> $${d3.format(",.2r")(d.Median)} 
                <br> <strong>Category:</strong> ${d.Category}
                <br> <strong>% Female:</strong> ${Math.round(d.ShareWomen*100)}%
                <br> <strong># Enrolled:</strong> ${d3.format(",.2r")(d.Total)}`)
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }

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
    
    svg.selectAll('text').remove()
    svg.selectAll('rect').remove()

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
        .transition('initial-scatter').duration(500).delay(500)
        .attr('fill', 'black')
        .attr('r', 3)
        .attr('cx', (d, i) => salaryXScale(d.Median))
        .attr('cy', (d, i) => i * 5.5 + 20)

}


function draw2(){
    let svg = d3.select("#vis").select('svg')
    
    svg.selectAll('g').remove()
    svg.selectAll('text').remove()
    svg.selectAll('rect').remove()

    svg.selectAll('circle')
        .transition('small-multiples-categories').duration(500).delay((d, i) => i * 5)
        .attr('r', d => salarySizeScale(d.Median))
        .attr('fill', d => categoryColorScale(d.Category))

    //Reheat simulation and restart
    simulation.alpha([1]).restart()

    svg.selectAll('text')
        .data(categories).enter()
        .append('text')
    
    // simulation.restart()
}

function draw3(){
    let svg = d3.select("#vis").select('svg')
    
    svg.selectAll('rect')
        .data(categories).enter()
        .append('rect')
            .transition().duration(200).delay((d, i) => i * 50)
            .attr('class', 'cat_rect')
            .attr('x', d => categoriesXY[d][0] + 120)
            .attr('y', d => categoriesXY[d][1] +80)
            .attr('width', 160)
            .attr('height', 30)
            .attr('opacity', 0.2)
            .attr('fill', 'grey')

    svg.selectAll('text')
            .text(d => d)
            .transition('label-small-multiple').duration(200).delay((d, i) => i * 50)
            .attr('x', d => categoriesXY[d][0] + 200)
            .attr('y', d => categoriesXY[d][1] + 100)
            .attr('class', 'cat_label')
            .attr('font-family', 'Domine')
            .attr('font-size', '12px')
            .attr('font-weight', 700)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')

    svg.selectAll('.cat_label')
        .on('mouseover', d => {
            d3.select(this).text('yo')
            console.log('yo')
        })

    
    
    
}

function draw32(){
    let svg = d3.select("#vis").select('svg')

    svg.selectAll('.cat_label')
        .transition().duration(200)
            .attr('fill', 'white')
            .attr('opacity', 1)
        .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
        .transition().duration(200)
            .attr('fill', 'black')
    
    svg.selectAll('circle')
        .transition('small-multiples-categories').duration(500).delay((d, i) => i * 5)
        .attr('r', d => salarySizeScale(d.Median))
        .attr('fill', d => categoryColorScale(d.Category))
}

function draw4(){

    simulation
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0]+ 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1]))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 2))

    simulation.alpha(1).restart()

    let svg = d3.select('#vis').select('svg')
    svg.selectAll('g').transition().duration(300).attr('opacity', 0).remove()
    svg.selectAll('path').transition().duration(500).attr('opacity', 0)
    svg.selectAll('text').transition().attr('opacity', 1)
    svg.selectAll('rect').transition().duration(100).attr('opacity', 0.2)

    svg.selectAll('circle')
        .transition('small-multiples-gender').duration(500).delay((d, i) => i * 5)
            .attr('fill', colorByGender)
            .attr('r', d => salarySizeScale(d.Median))
    
    svg.selectAll('.cat_label')
        .text(d => `% Female: ${categoriesXY[d][3]}%`)
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

function draw5(){
    simulation.stop()
    
    let svg = d3.select("#vis").select("svg")
    svg.selectAll('g').attr('opacity', 0).transition().remove()
    svg.selectAll('.cat_label').transition().attr('opacity', 0)
    svg.selectAll('.cat_rect').transition().duration(100).attr('opacity', 0)

    let xAxis = d3.axisBottom(shareWomenXScale)
    let yAxis = d3.axisLeft(salaryYScale)

    svg.selectAll('circle')
        .transition('gender-scatter').duration(1000)
        .attr('cx', d => shareWomenXScale(d.ShareWomen))
        .attr('cy', d => salaryYScale(d.Median))
        .attr('fill', colorByGender)
        .attr('r', 10)

    svg.append('g')
        .attr('opacity', 1)
        .call(xAxis)
            .transition(500)
            .attr('transform', `translate(0, ${height})`)
    
    svg.append('g')
        .attr('opacity', 1)
        .call(yAxis)
            .transition(500)
            .attr('transform', `translate(${margin.left - 20}, 0)`)

    const bestFitLine = [{x: 0, y: 56093}, {x: 1, y: 25423}]
    const lineFunction = d3.line()
                            .x(d => shareWomenXScale(d.x))
                            .y(d => salaryYScale(d.y))

    svg.append('path')
        .transition('best-fit-line').duration(400)
            .attr('opacity', 1)
            .attr('d', lineFunction(bestFitLine))
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', 6.2)
            .attr('opacity', 0.5)
            .attr('stroke-width', 3)
}


function draw6(){
    let svg = d3.select('#vis').select('svg')

    svg.selectAll('g').transition().remove()
    svg.selectAll('path').transition().duration(200).attr('opacity', 0).remove()

    simulation
        .force('forceX', d3.forceX(d => enrollmentScale(d.Total)))
        .force('forceY', d3.forceY(500))
        .force('collide', d3.forceCollide(d => enrollmentSizeScale(d.Total) + 5))

    svg.selectAll('circle')
        .transition('colour-by-cat')
        .attr('r', d => enrollmentSizeScale(d.Total))
        .attr('fill', d => categoryColorScale(d.Category))

    simulation.alpha(0.7).restart()
    

}

function draw7(){
    let svg = d3.select('#vis').select('svg')
    svg.selectAll('g').transition().remove()

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
    draw5, 
    draw6, 
    draw7
]


function temp(){

}


//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))

scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;
    
    // activationFunctions[index]()
    // activationFunctions[index]()

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){
        draw32();
    }
})