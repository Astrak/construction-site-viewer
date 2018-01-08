const ASSETS = {
  /* MAIN */
    arbres: {
      file: 'arbres.ply',
    },
    routes: {
      file: 'routes.ply',
    },
    bats: {
      file: 'batiments.ply',
    },
    trottoirs: {
      file: 'trottoirs.ply',
    },
  /* GARE */
    gare: {
      file: 'gare.ply',
      end: {
        year: 2018,
        month: 1,
        day: 0
      }
    },
    gareDemolition: {
      file: 'gare_demolition.ply',
      begin: {
        year: 2018,
        month: 1,
        day: 0
      },
      end: {
        year: 2018,
        month: 3,
        day: 0
      }
    },
  /* PARKING*/
    //1. remove trottoirs&routes above parking
    trottoirsGare: {
      file: 'trottoirs_gare.ply',
      end: {
        year: 2018,
        month: 3,
        day: 0
      }
    },
    routeGare: {
      file: 'route_gare.ply',
      end: {
        year: 2018,
        month: 3,
        day: 0
      }
    },
    //2. underground
    parkingConstruction: {
      file: 'parking_construction.ply',
      begin: {
        year: 2018,
        month: 3,
        day: 0
      },
      end: {
        year: 2019,
        month: 3,
        day: 0
      }
    },
    //3. top : surface
    parkingSurfaceConstruction: {
      file: 'parking_surface_construction.ply',
      begin: {
        year: 2019,
        month: 3,
        day: 0
      },
      end: {
        year: 2019,
        month: 10,
        day: 0
      }
    },
    //4. end : parking + arbres ( + game area)
    parkingSurface: {
      file: 'parking_surface.ply',
      begin: {
        year: 2019,
        month: 10,
        day: 0
      }
    },
    parkingArbres: {
      file: 'parking_arbres.ply',
      begin: {
        year: 2019,
        month: 10,
        day: 0
      }
    },
  /* PLACE */
    /*contreAlleesBasChantier: {
      file: '.ply',
      begin: {
        year: 2018,
        month: 5,
        day: 0
      },
      end: {
        year: 2018,
        month: 10,
        day: 0
      }
    },
    soult2: {
      file: '.ply',
      begin: {
        year: 2019,
        month: 6,
        day: 0
      }
    },*/
  /* INSTALLATION CHANTIER */
    chantier: {
      file: 'chantier.ply',
      begin: {
        year: 2018,
        month: 1,
        day: 0
      },
      end: {
        year: 2019,
        month: 10,
        day: 0
      }
    },
  /* VILLEGOUDOU */
    villegoudou1: {
      file: 'villegoudou1.ply',
      end: {
        year: 2018,
        month: 9,
        day: 0
      }
    },
    villegoudouConstruction: {
      file: 'villegoudou_construction.ply',
      begin: {
        year: 2018,
        month: 9,
        day: 0
      },
      end: {
        year: 2019,
        month: 2,
        day: 0
      }
    },
    villegoudou2: {
      file: 'villegoudou2.ply',
      begin: {
        year: 2019,
        month: 2,
        day: 0
      }
    }
};

export default ASSETS;