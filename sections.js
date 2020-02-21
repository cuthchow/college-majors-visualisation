function draw(){
    console.log('hello')
}

let activationFunctions = [
    draw, 
    draw
]

let scroll = scroller()
    .container(d3.select('#graphic'))

scroll()

scroll.on('active', function(index){
    console.log(index)
})