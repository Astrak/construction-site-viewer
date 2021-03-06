const HOTSPOTS = {
  soult: {
    camera: [ 23.92, 13.75, 5.23 ],
    center: [ 26, 0, 13 ],
    images: [
      { thumbnail : 'public/img/main_aerial-thumbnail.jpg', fullImage: 'public/img/main_aerial.jpg' },
      { thumbnail : 'public/img/fontaine-thumbnail.jpg', fullImage: 'public/img/fontaine.jpg' }
    ],
    begin: {
      month: 3,
      year: 2018
    },
    end: {
      month: 11,
      year: 2019
    }
  },
  villegoudou: {
    camera: [ 42.52, 4.68, 21.27 ],
    center: [ 37, 0, 16],
    images: [
      { thumbnail : 'public/img/villegoudou-thumbnail.jpg', fullImage: 'public/img/villegoudou.jpg' }
    ],
    begin: {
      year: 2018,
      month: 9
    },
    end: {
      year: 2019,
      month: 2
    }
  },
  gare: {
    camera: [ 8.77, 6.08, 13.07 ],
    center: [ 17, 0, 12 ],
    images: [],
    begin: {
      year: 2018,
      month: 0
    },
    end: {
      year: 2019,
      month: 10
    }
  }
};

export default HOTSPOTS;