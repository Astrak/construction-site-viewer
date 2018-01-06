const ASSETS = {
  /* MAIN */
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
        month: 1
      }
    },
    gareDemolition: {
      file: 'gare_demolition.ply',
      begin: {
        year: 2018,
        month: 1
      },
      end: {
        year: 2018,
        month: 3
      }
    },
  /* PARKING*/
    //1. remove trottoirs&routes above parking
    trottoirsGare: {
      file: 'trottoirs_gare.ply',
      end: {
        year: 2018,
        month: 3        
      }
    },
    routeGare: {
      file: 'route_gare.ply',
      end: {
        year: 2018,
        month: 3    
      }
    },
    //2. underground
    parkingConstruction: {
      file: 'parking_construction.ply',
      begin: {
        year: 2018,
        month: 3
      },
      end: {
        year: 2019,
        month: 3
      }
    },
    //3. top : surface
    parkingSurfaceConstruction: {
      file: 'parking_surface_construction.ply',
      begin: {
        year: 2019,
        month: 3
      },
      end: {
        year: 2019,
        month: 10
      }
    },
    //4. end : parking + arbres ( + game area)
    parkingSurface: {
      file: 'parking_surface.ply',
      begin: {
        year: 2019,
        month: 10
      }
    },
    parkingArbres: {
      file: 'parking_abres.ply',
      begin: {
        year: 2019,
        month: 10
      }
    },
  /* PLACE */
    /*contreAlleesBasChantier: {
      file: '.ply',
      begin: {
        year: 2018,
        month: 5
      },
      end: {
        year: 2018,
        month: 10
      }
    },
    soult2: {
      file: '.ply',
      begin: {
        year: 2019,
        month: 6
      }
    },*/
  /* INSTALLATION CHANTIER */
    chantier: {
      file: 'chantier.ply',
      begin: {
        year: 2018,
        month: 1
      },
      end: {
        year: 2019,
        month: 10
      }
    },
  /* VILLEGOUDOU */
    villegoudou1: {
      end: {
        file: 'villegoudou1.ply',
        year: 2018,
        month: 9
      }
    },
    villegoudouConstruction: {
      file: 'villegoudou_construction.ply',
      start: {
        year: 2018,
        month: 9
      },
      end: {
        year: 2019,
        month: 2
      }
    },
    villegoudou2: {
      file: 'villegoudou2.ply',
      begin: {
        year: 2019,
        month: 2
      }
    }
};

export default ASSETS;