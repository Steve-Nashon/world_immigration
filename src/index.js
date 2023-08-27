import {
    select,
    json,
    geoOrthographic,
    geoPath,
    selectAll
} from 'd3'
import {feature} from 'topojson'


let svg = select('svg')
            .attr('height',500)
            .attr('width',960)

const projection = geoOrthographic();
const pathGenerator = geoPath()
                        .projection(projection);

svg.append('path')
    .attr('d' ,d => pathGenerator({
        type: 'Sphere'
    }))
    .attr('fill', '#00a5a7')

let atlas = json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(
    jsondata => {

        let country = feature(jsondata, jsondata.objects.countries)
        
    //    const svg = body.append('svg')

        const paths = svg.selectAll('path')
                            .data(country.features)           
                    paths.enter()
                        .append('path')
                            .attr('d' ,d => pathGenerator(d))
                            .attr('fill', '#ded4d4')
                            .attr('stroke','black')
                            .attr('stroke-opacity', 0.1)


    }

)