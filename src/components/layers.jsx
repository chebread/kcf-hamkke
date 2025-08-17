const lineLayer = {
  id: 'lineLayer',
  type: 'line',
  source: 'directionsDatas',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#37b24d',
    'line-opacity': 0.9,
    'line-width': 5,
  },
};

export { lineLayer };
