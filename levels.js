function levels(){
  var grid = new Array(x)
  var levelstr = '11111111100001111111111111111111111111111111111111111010111111111111111110101111011111111111100011110111111111111111111101110001111100111111011101011111001111111111010111111111111111111111111111111111'

  for (i = 0; i < x; i++) {
    grid[i] = new Array(y)
    for (j = 0; j < y; j++) {
        grid[i][j] = levelstr[i*length(grid[i])+j]
    }
    console.log(i + ": " + grid[i]);
  }

}
