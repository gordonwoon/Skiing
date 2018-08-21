const getMap = () => {
  return fetch('./map.txt')
    .then((r) => r.text())
    .then(text  => {
      console.log('Data fetched');
      let array = text.split('\n');
      processData(array.reduce((acc, cur) => [ ...acc, cur.split(' ').map(value => parseInt(value, 10))], []));
    });
}

getMap();

const processData = (map) => {
  console.log('Processing data.. please wait');
  let bestCoord = {
    x: 0,
    y: 0,
    drop: 0,
    path: []
  };

  for(let x = 0; x < 1000; x++) {
    for(let y = 1; y < 1001; y++) {

      let currentCoord = {
        x: x,
        y: y,
        drop: 0,
        path: [{x, y, value: map[y][x]}]
      };

      bestCoord = getBestCoord([processCoord(x, y, map, currentCoord), bestCoord]);
    }
  }

  console.log(bestCoord);
}

const processCoord = (x, y, map, currentCoord) => {
  return getBestCoord([
    processNeighbour(x-1, y, x, y, map, {...currentCoord}),
    processNeighbour(x+1, y, x, y, map, {...currentCoord}),
    processNeighbour(x, y-1, x, y, map, {...currentCoord}),
    processNeighbour(x, y+1, x, y, map, {...currentCoord})
  ]);
}

const processNeighbour = (newX, newY, curX, curY, map, currentCoord) => {

  if(newX >= 0 && newX < 1000 && newY >= 1 && newY < 1001) {
    if(map[newY][newX] < map[curY][curX]) {
      let newPath = [...currentCoord.path];
      newPath.push({x: newX, y: newY, value: map[newY][newX]});
      currentCoord.path = [...newPath];
      currentCoord.drop += map[curY][curX] - map[newY][newX];
      return processCoord(newX, newY, map, currentCoord);
    }
  }
  return currentCoord;
}


const getBestCoord = (coordArray) => {
  let emptyCoord = {
    x: 0,
    y: 0,
    drop: 0,
    path: []
  };

  return coordArray.reduce((prev, curr) => {
    if(prev.path.length > curr.path.length) {
      return {...prev};
    }
    else if(prev.path.length === curr.path.length && prev.drop > curr.drop) {
      return {...prev};
    }
    return {...curr};
  }, emptyCoord)
}
