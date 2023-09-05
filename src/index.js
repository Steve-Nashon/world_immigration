import {
    select,
    json,
    geoOrthographic,
    geoPath,
    selectAll,
    zoom,
    zoomIdentity,
    pointer,
    zoomTransform,
    scaleLinear,
    drag
} from 'd3'
import {feature} from 'topojson'


const width = 960
const height = 500


let svg = select('svg')
            .attr('height',500)
            .attr('width',960)
            .attr("viewBox", [0, 0, width, height])
            .on("click", reset);


const globe = svg.append('g')
// .attr('class', 'maingroup')

const projection = geoOrthographic()
                    .scale(300)
                    // .clipAngle(90)
                    // .rotate([40.15931867632162, -37.707083712027384]);
const initialScale = projection.scale();
const pathGenerator = geoPath()
                        .projection(projection);






// add an event handler that gets called when a zoom or pan event occurs. 
// The event handler receives a transform which can be applied
let zoomed = (event) =>{
    const {transform} = event;
    // this is the same as transform = event.transform 
    // console.log('event')
    globe.attr("transform", transform);
    // g.attr("stroke-width", 1 / transform.k)
}


const zooom = zoom()
        .on('zoom', zoomed)



    svg.call(zooom)


.attr('fill', '#00a5a7')
function clicked(event, d) {
    // using Destructuring it extracts the bounds of the data element (d) using the path.bounds
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
    event.stopPropagation();
    // paths.transition().style("fill", null);
    select(this).transition().style("fill", "red");
    globe.transition().duration(750).call(
        // called to apply a new transformation
        zooom.transform,
        zoomIdentity
        // translates the center of the view to the center of the SVG
        .translate(width / 2, height / 2)
        // scales the view, ensuring that it does not exceed a maximum 
        // scale of 8 and is constrained by the aspect ratio of the bounding box.
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        // translates the view to center it within the bounding box 
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        // provide current pointer position within the SVG based on the click event
        pointer(event, svg.node())
        
    );
    }

    function reset() {
        // paths.transition().style("fill", null);
        select(this).transition().style("fill", null);
        svg.transition().duration(750).call(
        
        zooom.transform,
          zoomIdentity,
        zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
      }



let atlas = json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(
    jsondata => {

        let country = feature(jsondata, jsondata.objects.countries)
        
    //    const svg = body.append('svg')
    let moving = false
    globe.append('path')
        .attr('d' ,d => pathGenerator({ type: 'Sphere' }))
        .attr('fill', '#368DC5');    
    const render = () =>{

        const paths = globe.selectAll('path.country')
                            .data(country.features)       
                    paths.join(

                        enter =>{
                            enter
                            .append('path')
                                .attr('class', 'country')
                                .attr('d' ,d => pathGenerator(d))
                                .attr('fill', '#ded4d4')
                                .attr('stroke','black')
                                .attr('stroke-opacity', 0.1)
                                .on('click', clicked)
                            },

                        update =>{
                            update
                                .attr('d' ,d => pathGenerator(d))

                        }
                    )                  
                
                }
                render()

    let rotate0, coords0;
                const coords = (event) =>
                  projection
                    .rotate(rotate0)
                    .invert([event.x, event.y])


    let dragFunction = drag()
                    .on('start', (event) => {
                        rotate0 = projection.rotate();
                        coords0 = coords(event);
                    moving = true;
                    })
                    .on('drag', (event) => {  
                        const coords1 = coords(event);
                        projection.rotate([
                          rotate0[0] + coords1[0] - coords0[0],
                          rotate0[1] + coords1[1] - coords0[1],
                        ]);
                    render()
                    })
                    .on('end', () => {
                    moving = false;
                    render()      
                    })

    globe.call(dragFunction)
    

    }

)

