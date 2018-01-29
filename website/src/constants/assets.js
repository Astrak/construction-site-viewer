const ASSETS = {
  /* MAIN */
    arbres: {
      file: 'arbres.ply',
      map: 'platane.png',
      receiveShadow: false,
      material: 'basic',
      useCustomDepthMaterial: true,
      minFilter: 'linear',
      tweenColorWithDayLight: true,
      side: 'double',
      alphaTest: 0.7,
      transparent: true
    },
    routes: {
      color: 0x222222,
      file: 'routes.ply',
    },
    bats: {
      color: 0xaa8866,
      file: 'batiments.ply',
      map: 'bats_ao.png',
      useUv2: true
    },
    trottoirs: {
      color: 0x444444,
      file: 'trottoirs.ply',
    },
  /* GARE */
    gare: {
      file: 'gare.ply',
      color: 0xaa8866,
      end: {
        year: 2018,
        month: 1,
        day: 0
      }
    },
    gareDemolition: {
      file: 'gare_demolition.ply',
      color: 0x442211,
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
      color: 0x444444,
      end: {
        year: 2018,
        month: 3,
        day: 0
      }
    },
    routeGare: {
      file: 'route_gare.ply',
      color: 0x222222,
      end: {
        year: 2018,
        month: 3,
        day: 0
      }
    },
    //2. underground
    parkingConstruction: {
      file: 'parking_construction.ply',
      color: 0x442211,
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
      color: 0x442211,
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
    routeGare2: {
      file: 'route_gare2.ply',
      color: 0x222222,
      end: {
        year: 2019,
        month: 3,
        day: 0
      }
    },
    trottoirsGare2: {
      file: 'trottoirs_gare2.ply',
      color: 0x444444,
      end: {
        year: 2019,
        month: 3,
        day: 0
      }
    },
    contreallees2Chantier: {
      file: 'contreallees2-chantier.ply',
      color: 0x442211,
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
    contreallees2: {
      file: 'contreallees2.ply',
      map: 'parking.png',
      minFilter: 'linear',
      begin: {
        year: 2019,
        month: 3,
        day: 0
      },
      begin: {
        year: 2019,
        month: 10,
        day: 0
      }
    },
    //4. end : parking + arbres + vehicules ( + game area)
    parkingSurface: {
      file: 'parking_surface.ply',
      minFilter: 'linear',
      map: 'parking.png',
      begin: {
        year: 2019,
        month: 10,
        day: 0
      }
    },
    parkingSurfaceVehicules: {
      file: 'parking_surface_vehicules.ply',
      transparent: true,
      map: 'cars.png',
      begin: {
        year: 2019,
        month: 11,
        day: 0
      }
    },
    parkingArbres: {
      file: 'arbres-nouveaux-parking.ply',
      receiveShadow: false,
      map: 'erable.png',
      material: 'basic',
      useCustomDepthMaterial: true,
      minFilter: 'linear',
      tweenColorWithDayLight: true,
      side: 'double',
      alphaTest: 0.7,
      transparent: true,
      begin: {
        year: 2019,
        month: 11,
        day: 0
      }
    },
  /* PLACE SOULT-BUISSON */
    //cdg2a1
      routesCdg2a1: {
        file: 'routes-cdg2a1.ply',
        color: 0x222222,
        end: {
          year: 2018,
          month: 5,
          day: 0
        }
      },
      trottoirsCdg2a1: {
        file: 'trottoirs-cdg2a1.ply',
        color: 0x444444,
        end: {
          year: 2018,
          month: 5,
          day: 0
        }
      },
      cdg2a1Chantier: {
        file: 'cdg2a1-chantier.ply',
        color: 0x442211,
        begin: {
          year: 2018,
          month: 5,
          day: 0
        },
        end: {
          year: 2018,
          month: 8,
          day: 0
        }
      },
      cdg2a1: {
        file: 'cdg2a1.ply',
        minFilter: 'linear',
        map: 'parking.png',
        begin: {
          year: 2018,
          month: 8,
          day: 0
        }
      },
    //3a
      routes3a: {
        file: 'routes-3a.ply',
        color: 0x222222,
        end: {
          year: 2018,
          month: 8,
          day: 0
        }
      },
      trottoirs3a: {
        file: 'trottoirs-3a.ply',
        color: 0x444444,
        end: {
          year: 2018,
          month: 8,
          day: 0
        }
      },
      chantierContreAllees3a: {
        file: 'contreallees3a-chantier.ply',
        color: 0x442211,
        begin: {
          year: 2018,
          month: 8,
          day: 0
        },
        end: {
          year: 2018,
          month: 11,
          day: 0
        }
      },
      contreAllees3a: {
        file: 'contreallees3a.ply',
        color: 0x333333,
        begin: {
          year: 2018,
          month: 11,
          day: 0
        }
      },
    //4a
      routes4a: {
        file: 'routes-4a.ply',
        color: 0x222222,
        end: {
          year: 2019,
          month: 4,
          day: 0
        }
      },
      trottoirs4a: {
        file: 'trottoirs-4a.ply',
        color: 0x444444,
        end: {
          year: 2019,
          month: 4,
          day: 0
        }
      },
      chantier4a: {
        file: '4a-chantier.ply',
        color: 0x442211,
        begin: {
          year: 2019,
          month: 4,
          day: 0
        },
        end: {
          year: 2019,
          month: 10,
          day: 0
        }
      },
      trottoirs4a_2: {
        file: '4a-trottoir.ply',
        color: 0x333333,
        begin: {
          year: 2019,
          month: 10,
          day: 0
        }
      },
      routea4: {
        file: '4a-route.ply',
        color: 0x222222,
        begin: {
          year: 2019,
          month: 10,
          day: 0
        }
      },
    //4a1
      routesMinus4a1: {
        file: 'routes-4a1.ply',
        color: 0x222222,
        end: {
          year: 2019,
          month: 7,
          day: 0
        }
      },
      trottoirs4a1: {
        file: 'trottoirs-4a1.ply',
        color: 0x444444,
        end: {
          year: 2019,
          month: 7,
          day: 0
        }
      },
      chantier4a1: {
        file: '4a1-chantier.ply',
        color: 0x442211,
        begin: {
          year: 2019,
          month: 7,
          day: 0
        },
        end: {
          year: 2019,
          month: 10,
          day: 0
        }
      },
      buisson4a1: {
        file: '4a1.ply',
        color: 0x333333,
        begin: {
          year: 2019,
          month: 10,
          day: 0
        }
      },

    //arbres
      soultAnciensArbres: {
        file: 'arbres-soult.ply',
        map: 'platane.png',
        receiveShadow: false,
        useCustomDepthMaterial: true,
        minFilter: 'linear',
        tweenColorWithDayLight: true,
        material: 'basic',
        side: 'double',
        alphaTest: 0.7,
        transparent: true,
        end: {
          year: 2018,
          month: 11,
          day: 0
        }
      },
      buissonAnciensArbres: {
        file: 'arbres-buisson.ply',
        map: 'platane.png',
        receiveShadow: false,
        useCustomDepthMaterial: true,
        minFilter: 'linear',
        tweenColorWithDayLight: true,
        material: 'basic',
        side: 'double',
        alphaTest: 0.7,
        transparent: true,
        end: {
          year: 2018,
          month: 5,
          day: 0
        }
      },
      buissonNouveauxArbres: {
        file: 'arbres-nouveaux-buisson.ply',
        map: 'erable.png',
        receiveShadow: false,
        useCustomDepthMaterial: true,
        minFilter: 'linear',
        tweenColorWithDayLight: true,
        material: 'basic',
        side: 'double',
        alphaTest: 0.7,
        transparent: true,
        begin: {
          year: 2019,
          month: 11,
          day: 0
        }
      },
      soultNouveauxArbres: {
        file: 'arbres-nouveaux-soult.ply',
        map: 'erable.png',
        receiveShadow: false,
        useCustomDepthMaterial: true,
        minFilter: 'linear',
        tweenColorWithDayLight: true,
        material: 'basic',
        side: 'double',
        alphaTest: 0.7,
        transparent: true,
        begin: {
          year: 2019,
          month: 7,
          day: 0
        }
      },
    
    routesContreAllees: {
      file: 'route-contreallees.ply',
      color: 0x222222,
      end: {
        year: 2018,
        month: 5,
        day: 0
      }
    },
    routesSoult: {
      file: 'routes-soult.ply',
      color: 0x222222,
      end: {
        year: 2018,
        month: 11,
        day: 0
      }
    },
    trottoirsContreAllees: {
      file: 'trottoirs-contreallees.ply',
      color: 0x444444,
      end: {
        year: 2018,
        month: 5,
        day: 0
      }
    },
    soult1: {
      file: 'soult1.ply',
      color: 0x444444,
      end: {
        year: 2018,
        month: 11,
        day: 0
      }
    },
    contreallees: {
      file: 'contreallees.ply',
      map: 'parking.png',
      begin: {
        year: 2018,
        month: 11,
        day: 0
      }
    },
    contrealleesChantier: {
      file: 'contreallees-chantier.ply',
      color: 0x442211,
      begin: {
        year: 2018,
        month: 5,
        day: 0
      },
      end: {
        year: 2018,
        month: 11,
        day: 0
      }
    },
    soult2Chantier: {
      file: 'soult2-chantier.ply',
      color: 0x442211,
      begin: {
        year: 2018,
        month: 11,
        day: 0
      },
      end: {
        year: 2019,
        month: 6,
        day: 0
      }
    },
    soult2AireChantier: {
      file: 'soult2-aire-chantier.ply',
      color: 0x442211,
      begin: {
        year: 2019,
        month: 3,
        day: 0
      },
      end: {
        year: 2019,
        month: 6,
        day: 0
      }
    },
    soult2: {
      file: 'soult2.ply',
      minFilter: 'linear',
      map: 'parking.png',
      begin: {
        year: 2019,
        month: 6,
        day: 0
      }
    },
  /* INSTALLATION CHANTIER */
    chantier: {
      file: 'chantier.ply',
      color: 0xffbb55,
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
      color: 0x222222,
      end: {
        year: 2018,
        month: 9,
        day: 0
      }
    },
    trottoirsVillegoudou: {
      file: 'trottoirs-villegoudou.ply',
      color: 0x444444,
      end: {
        year: 2018,
        month: 9,
        day: 0
      }
    },
    villegoudouConstruction: {
      file: 'villegoudou_construction.ply',
      color: 0x442211,
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
    villegoudouConstructionMinusChantier: {
      file: 'villegoudou_construction-soult-chantier.ply',
      color: 0x442211,
      begin: {
        year: 2018,
        month: 9,
        day: 0
      },
      end: {
        year: 2018,
        month: 11,
        day: 0
      }
    },
    villegoudou2: {
      file: 'villegoudou2.ply',
      color: 0x222222,
      begin: {
        year: 2019,
        month: 2,
        day: 0
      }
    },
    villegoudou2Trottoirs: {
      file: 'villegoudou2-trottoirs.ply',
      color: 0x444444,
      begin: {
        year: 2019,
        month: 2,
        day: 0
      }
    }
};

export default ASSETS;