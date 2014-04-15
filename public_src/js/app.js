$(function () {

  var node_size = 8,
      node_border = 0,
      nodes_across = 360/4,
      data_count = 1000000;

  var createData, max_x, max_y, wrangleData, data, raw_data, pixels, g,
      svg = d3.select( '.d3big' ).append( 'svg' ),
      w = ( node_size + node_border + node_border ) * nodes_across,
      h = ( node_size + node_border + node_border ) * nodes_across,
      margin = 0,
      xScale = d3.scale.linear().range( [ 0, nodes_across ] ),
      yScale = d3.scale.linear().range( [ 0, nodes_across ] ),
      opacityScale = d3.scale.linear().range( [ 0, 1 ] ),
      max_count = 0;

  svg
   .attr( 'width', w )
   .attr( 'height', h );

  g = svg
    .append( 'g' )
    .attr( 'class', 'pixels' );


  createData = function ( count ) {
    var data = [], x, y;
    for ( var a = 0; a < count; a++ ) {
      x = Math.random() * 10000;
      y = Math.random() * 10000;

      max_x = max_x > x ? max_x : x;
      max_y = max_y > y ? max_y : y;

      data.push( {
        label: "data" + a,
        x: x,
        y: y
      });
    }
    return data;
  };

  wrangleData = function ( raw_data ) {
    var x, y,
        data_matrix =[],
        data = [];

    xScale.domain( [ 1, max_x ] );
    yScale.domain( [ 1, max_y ] );

    for ( var a = 0; a < raw_data.length; a++ ) {
      x = Math.round( xScale( raw_data[ a ].x ) );
      y = Math.round( xScale( raw_data[ a ].y ) );
      data_matrix[ x ] = data_matrix[ x ] || [ ];
      data_matrix[ x ][ y ] = data_matrix[ x ][ y ] || {count: 0, labels:[]}
      data_matrix[ x ][ y ].count++;

      if ( max_count < data_matrix[ x ][ y ].count ) {
        max_count = data_matrix[ x ][ y ].count;
      }

      data_matrix[ x ][ y ].labels.push( raw_data[ a ].label );
    }

    opacityScale.domain( [ data_count / nodes_across / nodes_across, max_count ] );

    for ( var x = 0; x < data_matrix.length; x++ ) {
      if ( data_matrix[ x ] ) {
        for ( var y = 0; y < data_matrix[ x ].length; y++ ) {
          if ( data_matrix[ x ][ y ] ) {
            data.push({
              labels: data_matrix[ x ][ y ].labels,
              count: data_matrix[ x ][ y ].count,
              x: x,
              y: y
            });
          }
        }
      }
    }
    return data;
  };
var d = new Date();
  raw_data = createData( data_count );
  data = wrangleData( raw_data );
console.log( new Date() - d, 'ms getting data into shape' );
  g_data = g.selectAll( 'rect' ).data( data )
  g_data.enter().append( 'rect' );
  g_data.exit().remove();
console.log( new Date() - d, 'ms creating dom elements' );

  g_data
      .attr( 'x', function ( d, i ) { return ( d.x * node_size ); } )
      .attr( 'y', function ( d, i ) { return ( d.y * node_size ); } )
      .attr( 'width', node_size )
      .attr( 'height', node_size )
      .attr( 'stroke', '#fff' )
      .attr( 'stroke-width', node_border )
      .attr( 'fill', function ( d, i ) {
        return 'rgba(0,0,0,' + opacityScale( d.count ) + ')';
      });
console.log( new Date() - d, 'ms appending into DOM' );
});
