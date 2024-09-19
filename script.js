//Fetching data
const videoGameUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
const movieUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
const kickstarterPledgesUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

Promise.all([
  fetch(videoGameUrl).then(response => response.json()),
  fetch(movieUrl).then(response => response.json()),
  fetch(kickstarterPledgesUrl).then(response => response.json())
])
.then(data => {
  const [videoGameData, movieData, kickstarterPledgesData] = data;

// Define the dimensions
const w = window.innerWidth * 0.75;
const h = window.innerHeight * 0.75;
const p = 60;

// Create treemapLayout
const root = d3.hierarchy(videoGameData)
               .sum(d => d.value)
               .sort((a, b) => b.value - a.value);

const treemapLayout = d3.treemap()
                        .size([w, h])
                        .paddingInner(1);
                        
                        
treemapLayout(root);


//Create color
const categories = Array.from(new Set(videoGameData.children.map(d => d.name)));
const colors = [
       "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", 
       "#ffdd33", "#a65628", "#f781bf", "#999999", "#66c2a5", 
       "#fc8d62", "#8da0cb", "#e73ac3", "#a6d854", "#ffd92f", 
       "#e5c494", "#b3b3b3", "#1b9e77"
     ];

const color = d3.scaleOrdinal()
                .domain(categories)
                .range(colors)

// Create SVG container
const svg = d3.select("#tree-map")
       .attr("width", w)
       .attr("height", h)
       .attr('transform', d => `translate(${2*p},0`);



// Create nodes
const nodes = svg.selectAll('g')
.data(root.leaves())
.enter()
.append('g')
.attr('transform', d => `translate(${d.x0},${d.y0})`);



nodes.append('rect')
.attr('width', d => d.x1 - d.x0)
.attr('height', d => d.y1 - d.y0)
.attr('class', 'tile')
.attr('data-name', d => d.data.name)
.attr('data-category', d => d.data.category)
.attr('data-value', d => d.data.value)
.attr('fill', d => color(d.data.category))
   .on("mousemove", function(event, d) {
       const dataValue = this.getAttribute('data-value')
       d3.select("#tooltip")
           .style("opacity", 1)
           .style("z-index", 0)
           .attr('data-value', dataValue)
           .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value:${d.data.value}`)
           .style("left", `${event.pageX - 110}px`)
           .style("top", `${event.pageY - 50}px`)
   })
.on("mouseout", function() {
d3.select("#tooltip")
       .style("opacity", 0)
       .style("z-index", -1)
});

const text = nodes.append('text')
                  .attr('class', 'name')
                  

text.selectAll('tspan')
       .data(d => d.data.name.split(/(?=[A-Z][a-z])/))
       .enter()
       .append('tspan')
       .attr('x', 5 )
       .attr('y', (d,i) => 13 + i*10 )
       .text(d => d)



// Add legend
const rectSize = 20
const legendLength = (categories.length - 1) * rectSize
const legend = d3.select("#legend")
              .attr("transform", `translate(${p},${(h - legendLength)/2})`)

const legendItem = legend.selectAll("g")
                     .data(color.domain())
                     .enter()
                     .append('g')
                     .attr("class", "legend-container")

legendItem.append('rect')
          .attr('x', (d,i) => i%2 * (rectSize + p))
          .attr('y', (d,i) => Math.floor(i/2) * (2 * rectSize))
          .attr("class", "legend-item")
          .attr('width',`${rectSize}px`)
          .attr('height', `${rectSize}px`)
          .attr('fill', d => color(d))

legendItem.append('text')
          .attr('x', (d,i) => i%2 * (rectSize + p))
          .attr('y', (d,i) => Math.floor(i/2) * (2 * rectSize))
          .attr("dx", `${rectSize + 5}px`)
          .attr("dy", `${rectSize/2 + 5}px`)
          .style("font-size", "18px")
          .attr('fill', 'white')
          .text(d => d) 

})


.catch(error => console.log('Error:', error));
