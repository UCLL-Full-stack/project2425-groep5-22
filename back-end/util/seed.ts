// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data
  await prisma.game.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.intensity.deleteMany();
  await prisma.user.deleteMany();

  // Create intensities
  const intensities = [
    { intensity: "Rustig", order: 1 },
    { intensity: "Matig", order: 2 },
    { intensity: "Zwaar", order: 3 },
    { intensity: "Hevig", order: 4 },
    { intensity: "Extreem", order: 5 }
  ];

  // Create and store intensities
  const intensityMap: Record<string, { id: number; intensity: string }> = {};

  for (const intensity of intensities) {
    const createdIntensity = await prisma.intensity.create({
      data: intensity
    });
    intensityMap[createdIntensity.intensity] = createdIntensity;
  }

  // Create users
  const matsevhPass = await bcrypt.hash("MatseVH", 10);
  const matse = await prisma.user.create({
    data: {
      username: "MatseVH",
      email: "matse@vanhorebeek.be",
      password: matsevhPass,
      role: "superadmin"
    }
  });

  // Create users
  const superadminPass = await bcrypt.hash("Superadmin!123", 10);
  const adminPass = await bcrypt.hash("Admin!123", 10);
  const guestPass = await bcrypt.hash("Guest!123", 10);

  const superadmin = await prisma.user.create({
    data: {
      username: "Superadmin",
      email: "superadmin@jeugdwerk.org",
      password: superadminPass,
      role: "superadmin"
    }
  });

  const admin = await prisma.user.create({
    data: {
      username: "Admin",
      email: "admin@jeugdwerk.org",
      password: adminPass,
      role: "admin"
    }
  });

  const guest = await prisma.user.create({
    data: {
      username: "Guest",
      email: "guest@jeugdwerk.org",
      password: guestPass,
      role: "guest"
    }
  });

  await prisma.game.create({
    data: {
      name: "Touwtrekken",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Zwaar"].id
        },
      },
      groups: true,
      duration: 30,
      explanation: "Twee teams trekken aan een touw in tegenovergestelde richtingen. Het team dat het touw over een bepaald punt trekt, wint.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Estafette",
      user: {
        connect: {
          id: admin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        },
      },
      groups: true,
      duration: 45,
      explanation: "Een klassiek estafettespel waarbij teams tegen elkaar strijden door een parcours te lopen en een voorwerp van de ene naar de andere speler over te dragen.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Snelheid" }, create: { tag: "Snelheid" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Blikgooien",
      user: {
        connect: {
          id: guest.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        },
      },
      groups: true,
      duration: 20,
      explanation: "Zet een piramide van blikken op en laat de kinderen proberen de blikken om te gooien met een bal.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Nauwkeurigheid" }, create: { tag: "Nauwkeurigheid" } },
          { where: { tag: "Balspel" }, create: { tag: "Balspel" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Zaklopen",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        },
      },
      groups: true,
      duration: 30,
      explanation: "Spelers stoppen zichzelf in een zak en springen naar de finishlijn. De eerste die de finish bereikt, wint.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Snelheid" }, create: { tag: "Snelheid" } },
          { where: { tag: "Simpel" }, create: { tag: "Simpel" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Scharenspringen",
      user: {
        connect: {
          id: admin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        },
      },
      groups: true,
      duration: 25,
      explanation: "Twee spelers houden een touw vast en draaien het. De andere spelers moeten eroverheen springen zonder het touw te raken.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Snelheid" }, create: { tag: "Snelheid" } },
          { where: { tag: "Reactievermogen" }, create: { tag: "Reactievermogen" } },
          { where: { tag: "Beweging" }, create: { tag: "Beweging" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Spijkerpoepen",
      user: {
        connect: {
          id: guest.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        },
      },
      groups: true,
      duration: 30,
      explanation: "Aan een stuk touw wordt een spijker bevestigd. De spelers moeten de spijker in een fles zien te krijgen zonder hun handen te gebruiken.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Nauwkeurigheid" }, create: { tag: "Nauwkeurigheid" } },
          { where: { tag: "Geduld" }, create: { tag: "Geduld" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Luchtballonrace",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        },
      },
      groups: true,
      duration: 20,
      explanation: "Gebruik ballonnen die de spelers moeten blazen om een race te winnen. De eerste die zijn ballon opblaast en het doel bereikt, wint.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Snelheid" }, create: { tag: "Snelheid" } },
          { where: { tag: "Lucht" }, create: { tag: "Lucht" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Wisselspel",
      user: {
        connect: {
          id: admin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Zwaar"].id
        },
      },
      groups: true,
      duration: 30,
      explanation: "Elke speler moet snel van positie veranderen zonder de anderen te laten merken. Dit spel test het reactievermogen en de snelheid.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Snelheid" }, create: { tag: "Snelheid" } },
          { where: { tag: "Reactievermogen" }, create: { tag: "Reactievermogen" } },
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Beweging" }, create: { tag: "Beweging" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Blinde dobbelsteen",
      user: {
        connect: {
          id: guest.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Rustig"].id
        },
      },
      groups: true,
      duration: 15,
      explanation: "De speler is geblinddoekt en moet proberen een dobbelsteen te rollen naar een doel, zonder te zien waar hij het gooit.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Nauwkeurigheid" }, create: { tag: "Nauwkeurigheid" } }
        ]
      }
    }
  })
  await prisma.game.create({
    data: {
      name: "Één tegen allen",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Rustig"].id
        },
      },
      groups: true,
      duration: 130,
      explanation: "Speluitleg\nEr wordt aan de spelers een lijst met allemaal verschillende opdrachten gegeven...",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "9-10 jaar" }, create: { tag: "9-10 jaar" } }
        ]
      }
    }
  })

  // [Previous games remain the same...]

  await prisma.game.create({
    data: {
      name: "Levend Memory",
      user: {
        connect: {
          id: admin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        }
      },
      groups: true,
      duration: 45,
      explanation: "Spelers vormen paren en krijgen elk een actie toegewezen. Ze staan verspreid in het veld. Één speler moet, zoals bij memory, de juiste paren vinden door spelers aan te wijzen die hun actie moeten uitvoeren.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Geheugen" }, create: { tag: "Geheugen" } },
          { where: { tag: "Beweging" }, create: { tag: "Beweging" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Vlaggenroof",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Zwaar"].id
        }
      },
      groups: true,
      duration: 60,
      explanation: "Twee teams hebben elk een vlag in hun gebied. Het doel is om de vlag van het andere team te stelen en naar je eigen gebied te brengen, terwijl je je eigen vlag beschermt. Als je wordt getikt in het gebied van de tegenstander, ga je naar de gevangenis.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Strategie" }, create: { tag: "Strategie" } },
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Renspel" }, create: { tag: "Renspel" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Levend Stratego",
      user: {
        connect: {
          id: guest.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Zwaar"].id
        }
      },
      groups: true,
      duration: 90,
      explanation: "Gebaseerd op het bordspel Stratego. Spelers krijgen rangen toegewezen en proberen de vlag van het andere team te vinden. Bij ontmoetingen tonen spelers hun rang, de laagste rang verliest.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Strategie" }, create: { tag: "Strategie" } },
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Waterstafette",
      user: {
        connect: {
          id: admin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        }
      },
      groups: true,
      duration: 30,
      explanation: "Teams moeten water van punt A naar punt B transporteren met behulp van verschillende voorwerpen (bekertjes, sponzen, etc.). Het team dat het meeste water verzamelt, wint.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Water" }, create: { tag: "Water" } },
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "Zomer" }, create: { tag: "Zomer" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Ninja",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        }
      },
      groups: true,
      duration: 20,
      explanation: "Spelers staan in een cirkel en maken om de beurt één beweging om de handen van andere spelers te raken. Als je hand geraakt wordt, verlies je die hand. Verlies je beide handen, dan ben je af.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Reactievermogen" }, create: { tag: "Reactievermogen" } },
          { where: { tag: "Behendigheid" }, create: { tag: "Behendigheid" } },
          { where: { tag: "Simpel" }, create: { tag: "Simpel" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Weerwolven",
      user: {
        connect: {
          id: guest.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Rustig"].id
        }
      },
      groups: true,
      duration: 45,
      explanation: "Een rollenspel waarbij spelers dorpelingen of weerwolven zijn. 's Nachts eten weerwolven een dorpeling, overdag stemmen dorpelingen wie ze verdenken. Het spel gaat door tot alle weerwolven of dorpelingen zijn uitgeschakeld.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Strategie" }, create: { tag: "Strategie" } },
          { where: { tag: "Rollenspel" }, create: { tag: "Rollenspel" } },
          { where: { tag: "Binnen" }, create: { tag: "Binnen" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Levend Pac-Man",
      user: {
        connect: {
          id: admin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Zwaar"].id
        }
      },
      groups: true,
      duration: 40,
      explanation: "Een speler is Pac-Man, anderen zijn spoken of punten. Pac-Man moet alle punten verzamelen terwijl hij de spoken ontwijkt. Power-ups maken spoken tijdelijk kwetsbaar.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Renspel" }, create: { tag: "Renspel" } },
          { where: { tag: "Beweging" }, create: { tag: "Beweging" } },
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } }
        ]
      }
    }
  })

  await prisma.game.create({
    data: {
      name: "Hints Estafette",
      user: {
        connect: {
          id: superadmin.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Matig"].id
        }
      },
      groups: true,
      duration: 35,
      explanation: "Teams staan in rijen. De eerste speler krijgt een woord te zien en moet dit uitbeelden aan de tweede speler, die het weer doorgeeft aan de derde, enzovoort. Het laatste teamlid moet het juiste woord raden.",
      tags: {
        connectOrCreate: [
          { where: { tag: "Teamspel" }, create: { tag: "Teamspel" } },
          { where: { tag: "Communicatie" }, create: { tag: "Communicatie" } },
          { where: { tag: "Creatief" }, create: { tag: "Creatief" } }
        ]
      }
    }
  })

};

(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
