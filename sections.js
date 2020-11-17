let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend

const gender_categories = ['Male', 'Female']
const genre_categories = ['ACTION','ACTION_COMEDY','ADVENTURE','ANIMATION','COMEDY','DRAMA','FAMILY','HISTORICAL','HORROR','HORROR_COMEDY','MUSICAL','ROMANCE','ROMANTIC_COMEDY','SCIFI/FANTASY','THRILLER','DOCUMENTARY']
const categories = ['Engineering', 'Business', 'Physical Sciences', 'Law & Public Policy', 'Computers & Mathematics', 'Agriculture & Natural Resources',
'Industrial Arts & Consumer Services','Arts', 'Health','Social Science', 'Biology & Life Science','Education','Humanities & Liberal Arts',
'Psychology & Social Work','Communications & Journalism','Interdisciplinary']

const gender_categoriesXY = {'Female': [0, 500, 2537348.61, 48.3], 'Male': [500, 500, 3071240.51, 74.9]}
const genre_categoriesXY = {'ACTION': [0, 400, 'ACTION', 23.9],
                                'ACTION_COMEDY': [0, 600, 'ACTION COMEDY', 48.3],
                                'ADVENTURE': [0, 800, 'ADVENTURE', 50.9],
                                'ANIMATION': [0, 200, 'ANIMATION', 48.3],
                                'COMEDY': [200, 400, 'COMEDY', 31.2],
                                'DRAMA': [200, 600, 'DRAMA', 40.5],
                                'FAMILY': [200, 800, 'FAMILY', 35.0],
                                'HISTORICAL': [200, 200, 'HISTORICAL', 60.4],
                                'HORROR': [400, 400, 'HORROR', 79.5],
                                'HORROR_COMEDY': [400, 600, 'HORROR COMEDY', 55.4],
                                'MUSICAL': [400, 800, 'MUSICAL', 58.7],
                                'ROMANCE': [400, 200, 'ROMANCE', 74.9],
                                'ROMANTIC_COMEDY': [600, 400, 'ROMANTIC COMEDY', 63.2],
                                'SCIFI/FANTASY': [600, 600, 'SCIFI/FANTASY', 79.4],
                                'THRILLER':[600, 800, 'THRILLER', 65.9],
                                'DOCUMENTARY':[600, 200, 'DOCUMENTARY', 77.1]}
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

const margin = {left: 170, top: 50, bottom: 50, right: 20}
const width = 1000 - margin.left - margin.right
const height = 950 - margin.top - margin.bottom

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv('data/processed_df_Nov17.csv', function(d){
    return {
        Year: +d.year,
        Month: +d.month,
        Day: +d.day,
        Title: d.title,
        Genre: d.genre_final,
        Gross: +d.gross_adj,
        Budget: +d.budget_adj,
        Male: +d.male_dist7,
        Female: +d.female_dist7,
        Gender: d.gender_majority,
        YearCol: +d.year_col
        // Major: d.Major,
        // Total: +d.Total,
        // Men: +d.Men,
        // Women: +d.Women,
        // Median: +d.Median,
        // Unemployment: +d.Unemployment_rate,
        // Category: d.Major_category,
        // ShareWomen: +d.ShareWomen, 
        // HistCol: +d.Histogram_column,
        // Midpoint: +d.midpoint
    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales()
    setTimeout(drawInitial(), 100)
})

const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff']

//Create all the scales and save to global variables

function createScales(){
    //salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [5, 35])
    grossSizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Gross), [5, 35])
    grossXScale = d3.scaleLinear(d3.extent(dataset, d => d.Gross), [margin.left, margin.left + width+250])
    budgetXScale = d3.scaleLinear(d3.extent(dataset, d => d.Budget), [margin.left, margin.left + width+250])
    grossYScale = d3.scaleLinear(d3.extent(dataset, d => d.Gross), [margin.top + height, margin.top])
    zbudgetXScale = d3.scaleLinear([2000,15000000], [margin.left, margin.left + width+250])
    zgrossYScale = d3.scaleLinear([2000,15000000], [margin.top + height, margin.top])
    categoryColorScale = d3.scaleOrdinal(gender_categories, colors)
    genreColorScale = d3.scaleOrdinal(genre_categories, colors)
    yearSizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Year), [5, 35])
    yearXScale = d3.scaleLinear([2000,2020], [margin.left, margin.left + width])
    yearYScale = d3.scaleLinear(d3.extent(dataset, d => d.YearCol), [margin.top + height, margin.top])
    //shareWomenXScale = d3.scaleLinear(d3.extent(dataset, d => d.ShareWomen), [margin.left, margin.left + width])
   // enrollmentScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [margin.left + 120, margin.left + width - 50])
    //enrollmentSizeScale = d3.scaleLinear(d3.extent(dataset, d=> d.Total), [10,60])
    //histXScale = d3.scaleLinear(d3.extent(dataset, d => d.Midpoint), [margin.left, margin.left + width])
   // histYScale = d3.scaleLinear(d3.extent(dataset, d => d.HistCol), [margin.top + height, margin.top])
}

function createLegend(x, y){
    let svg = d3.select('#legend')

    svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)

    categoryLegend = d3.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                            .shapePadding(10)
                            .scale(genreColorScale)
    
    d3.select('.categoryLegend')
        .call(categoryLegend)
}

function createSizeLegend(){
    let svg = d3.select('#legend2')
    svg.append('g')
        .attr('class', 'sizeLegend')
        .attr('transform', `translate(100,50)`)

    sizeLegend2 = d3.legendSize()
        .scale(grossSizeScale)
        .shape('circle')
        .shapePadding(15)
        .title('Box Office Scale')
        .labelFormat(d3.format("$,.2r"))
        .cells(7)

    d3.select('.sizeLegend')
        .call(sizeLegend2)
}

function createSizeLegend2(){
    let svg = d3.select('#legend3')
    svg.append('g')
        .attr('class', 'sizeLegend2')
        .attr('transform', `translate(50,100)`)

    sizeLegend2 = d3.legendSize()
        .scale(grossSizeScale)
        .shape('circle')
        .shapePadding(55)
        .orient('horizontal')
        .title('Enrolment Scale')
        .labels(['1000', '200000', '40000'])
        .labelOffset(30)
        .cells(3)

    d3.select('.sizeLegend2')
        .call(sizeLegend2)
}

// All the initial elements should be create in the drawInitial function
// As they are required, their attributes can be modified
// They can be shown or hidden using their 'opacity' attribute
// Each element should also have an associated class name for easy reference

function drawInitial(){
    console.log('drawInitial')
    createSizeLegend()
    createSizeLegend2()

    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
                    .attr('opacity', 1)



    //Instantiates the force simulation
    //Has no forces. Actual forces are added and removed as required

    simulation = d3.forceSimulation(dataset)

     // Define each tick of simulation
    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    // Stop the simulation until later
    simulation.stop()

    // Selection of all the circles 
    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('fill', d => categoryColorScale(d.Gender))
            .attr('r', 10)
            .attr('cx', (d, i) => i * 5.2 * Math.random())
            .attr('cy', (d, i) => i * 5.2 * Math.random())
            .attr('opacity', 0.8)
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        console.log('hi')
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`<strong>Title:</strong> ${d.Title} 
                <br> <strong>Genre:</strong> ${d.Genre} 
                <br> <strong>Majority Cast:</strong> ${d.Gender}
                <br> <strong>Female %:</strong> ${d.Female}
                <br> <strong>Male %:</strong> ${d.Male}
                <br> <strong>Box Office : </strong> ${d.Gross}
                <br> <strong>Budget: </strong> ${d.Budget}
                <br> <strong>Year Produced: </strong> ${d.Year}`)
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }

    //Small text label for first graph
     svg.selectAll('.small-text')
         .data(dataset)
         .enter()
        .append('text')
            .text((d, i) => d.Title)
            .attr('class', 'small-text')
            .attr('x', margin.left)
            .attr('y', (d, i) => i * 5.2 + 30)
            .attr('font-size', 7)
            .attr('text-anchor', 'end')
            .attr('opacity', 0.0)
    
    //All the required components for the small multiples charts
    //Initialises the text and rectangles, and sets opacity to 0 
    svg.selectAll('.cat-rect')
        .data(gender_categories).enter()
        .append('rect')
            .attr('class', 'cat-rect')
            .attr('x', d => gender_categoriesXY[d][0] + 120 + 1000)
            .attr('y', d => gender_categoriesXY[d][1] + 30)
            .attr('width', 160)
            .attr('height', 30)
            .attr('opacity', 0)
            .attr('fill', 'grey')
    svg.selectAll('.genre-rect')
        .data(genre_categories).enter()
        .append('rect')
            .attr('class', 'genre-rect')
            .attr('x', d => genre_categoriesXY[d][0] + 120 + 1000)
            .attr('y', d => genre_categoriesXY[d][1] + 30)
            .attr('width', 160)
            .attr('height', 30)
            .attr('opacity', 0)
            .attr('fill', 'grey')
    svg.selectAll('.genre-lab-text')
            .data(genre_categories).enter()
            .append('text')
            .attr('class', 'genre-lab-text')
            .attr('opacity', 0)
            .raise()
    
    svg.selectAll('.genre-lab-text')
            .text(d => `Average: $${d3.format(",.2r")(genre_categoriesXY[d][2])}`)
            .attr('x', d => genre_categoriesXY[d][0] + 200 + 1000)
            .attr('y', d => genre_categoriesXY[d][1] - 500)
            .attr('font-family', 'Domine')
            .attr('font-size', '12px')
            .attr('font-weight', 700)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')       
    
    svg.selectAll('.genre-lab-text')
                .on('mouseover', function(d, i){
                    d3.select(this)
                        .text(d)
                })
                .on('mouseout', function(d, i){
                    d3.select(this)
                        .text(d => genre_categoriesXY[d][2])
                })
    
    svg.selectAll('.lab-text')
        .data(gender_categories).enter()
        .append('text')
        .attr('class', 'lab-text')
        .attr('opacity', 0)
        .raise()

    svg.selectAll('.lab-text')
        .text(d => `Average: $${d3.format(",.2r")(gender_categoriesXY[d][2])}`)
        .attr('x', d => gender_categoriesXY[d][0] + 200 + 1000)
        .attr('y', d => gender_categoriesXY[d][1] - 500)
        .attr('font-family', 'Domine')
        .attr('font-size', '12px')
        .attr('font-weight', 700)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')       

    svg.selectAll('.lab-text')
            .on('mouseover', function(d, i){
                d3.select(this)
                    .text(d)
            })
            .on('mouseout', function(d, i){
                d3.select(this)
                    .text(d => `Average: $${d3.format(",.2r")(gender_categoriesXY[d][2])}`)
            })


    // Best fit line for gender scatter plot

    const bestFitLineFemale = [{x: 0, y: 360517}, {x: 42000000, y: 42350647.0}]
    const bestFitLineMale = [{x: 0, y: 2607780}, {x: 42000000, y: 26206908}]
    const bestFitLineFemalez = [{x: 0, y: 360517}, {x: 15000000, y: 15356992.0}]
    const bestFitLineMalez = [{x: 0, y: 2607780}, {x: 15000000, y: 11036040}]
    const lineFunction = d3.line()
                            .x(d => budgetXScale(d.x))
                            .y(d => grossYScale(d.y))
    const zlineFunction = d3.line()
                            .x(d => zbudgetXScale(d.x))
                            .y(d => zgrossYScale(d.y))

    // Axes for Scatter Plot
    svg.append('path')
        .transition('best-fit-line-female').duration(430)
            .attr('class', 'best-fit-female')
            .attr('d', lineFunction(bestFitLineFemale))
            .attr('stroke', '#CD0000')
            .attr('stroke-dasharray', 6.2)
            .attr('opacity', 0)
            .attr('stroke-width', 3)
    svg.append('path')
        .transition('best-fit-line-male').duration(430)
            .attr('class', 'best-fit-male')
            .attr('d', lineFunction(bestFitLineMale))
            .attr('stroke', '#EB7A00')
            .attr('stroke-dasharray', 6.2)
            .attr('opacity', 0)
            .attr('stroke-width', 3)
    svg.append('path')
        .transition('z-best-fit-line-female').duration(430)
            .attr('class', 'z-best-fit-female')
            .attr('d', zlineFunction(bestFitLineFemalez))
            .attr('stroke', '#CD0000')
            .attr('stroke-dasharray', 6.2)
            .attr('opacity', 0)
            .attr('stroke-width', 3)
    svg.append('path')
        .transition('z-best-fit-line-male').duration(430)
            .attr('class', 'z-best-fit-male')
            .attr('d', zlineFunction(bestFitLineMalez))
            .attr('stroke', '#EB7A00')
            .attr('stroke-dasharray', 6.2)
            .attr('opacity', 0)
            .attr('stroke-width', 3)

    let scatterxAxis = d3.axisBottom(grossXScale)
    let scatteryAxis = d3.axisLeft(grossYScale).tickSize([width])

    let zscatterxAxis = d3.axisBottom(zbudgetXScale)
    let zscatteryAxis = d3.axisLeft(zgrossYScale).tickSize([width])

    svg.append('g')
        .call(scatterxAxis)
        .attr('class', 'scatter-x')
        .attr('opacity', 0)
        .attr('transform', `translate(0, ${height + margin.top})`)
        .call(g => g.select('.domain')
            .remove())
    
    svg.append('g')
        .call(scatteryAxis)
        .attr('class', 'scatter-y')
        .attr('opacity', 0)
        .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    svg.append('g')
        .call(zscatterxAxis)
        .attr('class', 'z-scatter-x')
        .attr('opacity', 0)
        .attr('transform', `translate(0, ${height + margin.top})`)
        .call(g => g.select('.domain')
            .remove())
        
    svg.append('g')
        .call(zscatteryAxis)
        .attr('class', 'z-scatter-y')
        .attr('opacity', 0)
        .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    // Axes for Histogram 

    let histxAxis = d3.axisBottom(grossSizeScale)

    svg.append('g')
        .attr('class', 'enrolment-axis')
        .attr('transform', 'translate(0, 700)')
        .attr('opacity', 0)
        .call(histxAxis)

    // Axes for Barplot
    let barxAxis = d3.axisBottom(yearSizeScale)

    svg.append('g')
        .attr('class', 'enrolment-axis')
        .attr('transform', 'translate(0, 700)')
        .attr('opacity', 0)
        .call(barxAxis)
}

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isScatterFull") {
        svg.select('.scatter-x').transition().attr('opacity', 0)
        svg.select('.scatter-y').transition().attr('opacity', 0)
        svg.selectAll('.z-scatter-x').transition().attr('opacity', 0)
        svg.selectAll('.z-scatter-y').transition().attr('opacity', 0)
        svg.select('.best-fit-female').transition().duration(200).attr('opacity', 0)
        svg.select('.best-fit-male').transition().duration(200).attr('opacity', 0)
    }
    if (chartType !== "isScatterZoom")
        svg.selectAll('.scatter-x').transition().attr('opacity', 0)
        svg.selectAll('.scatter-y').transition().attr('opacity', 0)
        svg.selectAll('.z-scatter-x').transition().attr('opacity', 0)
        svg.selectAll('.z-scatter-y').transition().attr('opacity', 0)
        svg.select('.z-best-fit-female').transition().duration(200).attr('opacity', 0)
        svg.select('.z-best-fit-male').transition().duration(200).attr('opacity', 0)

    if (chartType !== "isMultiples"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "isMultiplesGenre"){
        svg.selectAll('.genre-lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.genre-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "isHist"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
    }
    if (chartType !== "isBubble"){
        svg.select('.enrolment-axis').transition().attr('opacity', 0)
    }
}

//First draw function

function draw8(){
    console.log('draw8')
    //Stop simulation
    simulation.stop()
    
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
    
    clean('isFirst')

    d3.select('.categoryLegend').transition().remove()

    svg.select('.first-axis')
        .attr('opacity', 1)
    
    svg.selectAll('circle')
        .transition().duration(500).delay(100)
        .attr('fill', 'black')
        .attr('r', 3)
        .attr('cx', (d, i) => Math.random())
        .attr('cy', (d, i) => Math.random())

    svg.selectAll('.small-text').transition()
        .attr('opacity', 1)
        .attr('x', margin.left)
        .attr('y', (d, i) => i * 5.2 + 30)
}


function draw2(){
    console.log('draw2')
    let svg = d3.select("#vis").select('svg')

    clean('isMultiplesGenre')
    
    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 5)
        .attr('r', 5)
        .attr('fill', d => categoryColorScale(d.Gender))

    svg.selectAll('.genre-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => genre_categoriesXY[d][0] + 120)
        
    svg.selectAll('.genre-lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => genre_categoriesXY[d][2])
        .attr('x', d => genre_categoriesXY[d][0] + 200)   
        .attr('y', d => genre_categoriesXY[d][1] + 50)
        .attr('opacity', 1)

    svg.selectAll('.genre-lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d)
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => (genre_categories[d]))
        })

    simulation  
        .force('charge', d3.forceManyBody().strength([2]))
        .force('forceX', d3.forceX(d => genre_categoriesXY[d.Genre][0] + 200))
        .force('forceY', d3.forceY(d => genre_categoriesXY[d.Genre][1] - 50))
        .force('collide', d3.forceCollide(d => 3 + 2))
        .alpha(0.7).alphaDecay(0.02).restart()




    //Reheat simulation and restart
    simulation.alpha(0.9).restart()
    createLegend(20, 50)
}

function draw3(){
    console.log('draw3')
    let svg = d3.select("#vis").select('svg')
    clean('isMultiples')
    
    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 5)
        .attr('r', d => grossSizeScale(d.Gross) * 1.2)
        .attr('fill', d => categoryColorScale(d.Gender))

    svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => gender_categoriesXY[d][0] + 120)
        
    svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => `Average: $${d3.format(",.2r")(gender_categoriesXY[d][2])}`)
        .attr('x', d => gender_categoriesXY[d][0] + 200)   
        .attr('y', d => gender_categoriesXY[d][1] + 50)
        .attr('opacity', 1)

    svg.selectAll('.lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d)
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => `Average: $${d3.format(",.2r")(gender_categories[d][2])}`)
        })

    simulation  
        .force('charge', d3.forceManyBody().strength([2]))
        .force('forceX', d3.forceX(d => gender_categoriesXY[d.Gender][0] + 200))
        .force('forceY', d3.forceY(d => gender_categoriesXY[d.Gender][1] - 50))
        .force('collide', d3.forceCollide(d => grossSizeScale(d.Gross) + 4))
        .alpha(0.7).alphaDecay(0.02).restart()

}

function draw1(){
    console.log('draw1')
    
    let svg = d3.select('#vis').select('svg')
    clean('isMultiples')

    simulation
        .force('forceX', d3.forceX(d => gender_categoriesXY[d.Gender][0] + 200))
        .force('forceY', d3.forceY(d => gender_categoriesXY[d.Gender][1] - 50))
        .force('collide', d3.forceCollide(d => grossSizeScale(d.Gross) + 4))

    simulation.alpha(1).restart()
   
    svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => `% Female: ${(gender_categoriesXY[d][3])}%`)
        .attr('x', d => gender_categoriesXY[d][0] + 200)   
        .attr('y', d => gender_categoriesXY[d][1] + 50)
        .attr('opacity', 1)
    
    svg.selectAll('.lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d)
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => `% Female: ${(gender_categoriesXY[d][3])}%`)
        })
   
    svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => gender_categoriesXY[d][0] + 120)

    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 4)
            .attr('fill', d => categoryColorScale(d.Gender))
            .attr('r', d => grossSizeScale(d.Gender))

}

function draw5(){
    console.log('draw5')
    simulation.stop()
    
    let svg = d3.select("#vis").select("svg")
    clean('isScatterFull')

    svg.selectAll('.scatter-x').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.scatter-y').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeBack)
        .attr('cx', d => budgetXScale(d.Budget))
        .attr('cy', d => grossYScale(d.Gross))
    
    svg.selectAll('circle').transition(1600)
        .attr('fill', d => categoryColorScale(d.Gender))
        .attr('r', 10)

    svg.select('.best-fit-male').transition().duration(300)
        .attr('opacity', 0.5)
    svg.select('.best-fit-female').transition().duration(300)
        .attr('opacity', 0.5)
}

function draw6(){
    console.log('draw6')
    let svg = d3.select('#vis').select('svg')


    clean('isScatterZoom')
    svg.selectAll('.scatter-x').transition().attr('opacity', 0.0).selectAll('.domain').attr('opacity', 0)
    svg.selectAll('.scatter-y').transition().attr('opacity', 0.0).selectAll('.domain').attr('opacity', 0)
    svg.selectAll('.z-scatter-x').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.z-scatter-y').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeBack)
        .attr('cx', d => zbudgetXScale(d.Budget))
        .attr('cy', d => zgrossYScale(d.Gross))
    
    svg.selectAll('circle').transition(1600)
        .attr('fill', d => categoryColorScale(d.Gender))
        .attr('r', 10)

    svg.select('.z-best-fit-female').transition().duration(300)
        .attr('opacity', 0.5)
    svg.select('.z-best-fit-male').transition().duration(300)
        .attr('opacity', 0.5)

}

function draw4(){
    console.log('draw4')
    let svg = d3.select('#vis').select('svg')

    clean('isHist')

    simulation.stop()

    svg.selectAll('circle')
        .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
            .attr('cx', d => yearXScale(d.Year))
            .attr('cy', d => yearYScale(d.YearCol))
            .attr('fill', d => categoryColorScale(d.Gender))
            .attr('r', d => grossSizeScale(d.Gross) * 1.2)

    let xAxis = d3.axisBottom(yearXScale)
    svg.append('g')
        .attr('class', 'hist-axis')
        .attr('transform', `translate(0, ${height + margin.top + 10})`)
        .call(xAxis)

    svg.selectAll('.lab-text')
        .on('mouseout', )
}

function draw7(){
    console.log('draw7')
    clean('none')

    let svg = d3.select('#vis').select('svg')
    svg.selectAll('circle')
        .transition()
        .attr('r', d => grossSizeScale(d.Gross) * 1.6)
        .attr('fill', d => categoryColorScale(d.Gender))

    simulation 
        .force('forceX', d3.forceX(500))
        .force('forceY', d3.forceY(500))
        .force('collide', d3.forceCollide(d => grossSizeScale(d.Gross) * 1.6 + 4))
        .alpha(0.6).alphaDecay(0.05).restart()
        
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
    draw7,
    draw8
]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})