// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data
  await prisma.game.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.media.deleteMany();
  await prisma.intensity.deleteMany();
  await prisma.user.deleteMany();

  // Create tags
  await prisma.tag.createMany({
    data: [
      { tag: "Buiten" },
      { tag: "Binnen" },
      { tag: "Op een plein" },
      { tag: "9-10 jaar" }
    ]
  });

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

  await prisma.user.createMany({
    data: [
      {
        username: "Superadmin",
        email: "superadmin@jeugdwerk.org",
        password: superadminPass,
        role: "superadmin"
      },
      {
        username: "Admin",
        email: "admin@jeugdwerk.org",
        password: adminPass,
        role: "admin"
      },
      {
        username: "Guest",
        email: "guest@jeugdwerk.org",
        password: guestPass,
        role: "guest"
      }
    ]
  });

  await prisma.game.create({
    data: {
      name: "Één tegen allen",
      user: {
        connect: {
          id: matse.id
        }
      },
      intensity: {
        connect: {
          id: intensityMap["Rustig"].id
        },
      },
      groups: true,
      duration: 130,
      explanation: "Speluitleg\nEr wordt aan de spelers een lijst met allemaal verschillende opdrachten gegeven, het is de bedoeling dat alle opdrachten met succes worden volbracht.\nBij één tegen alle wordt er een lijst van allemaal verschillende opdrachten aan de spelers gegeven, het doen van het spel is dat de spelers al deze opdrachten zo snel mogelijk tot een goed einde volbrengen.\nDe opdrachten kunnen aangepast worden per leeftijd, thema, weersomstandigheden, ....\nVariatie\nVariatie 1 Als variatie op het spel kan er gekozen worden om de spelers op te delen in een 2 groepen.\nVariatie 2 Voor de 2de variatie worden de spelers weer in 2 groepen opgedeeld.\nHierbij moeten de 2 groepen opdrachten voor elkaar verzinnen.\nAls al de opdrachten verzonnen zijn krijgen beide groepen even de tijd om de opdrachten door te lezen waarna elke groep 1 opdracht mag terug sturen en 1 opdracht mag schrappen.\nDe groep die als eerste alle opdrachten tot een goed einde brengt wint.\nVoorbeeld opdrachten\nKnijp zoveel mogelijk wasknijpers op je oren.\nVerzamel lippenstiftkusjes van alle spelers.\nDoe een klusje in het lokaal of op het terrein (papiertjes rapen, iets opruimen, enz.).\nMaak een dierenketting met 20 dieren.\nHoger-lager: Leg tien foto’s van leden in willekeurige volgorde naast elkaar.\nDe beeldzijde mag niet zichtbaar zijn.\nDraai de foto’s een na een om.\nDe spelers moeten raden of de volgende persoon ouder of jonger zal zijn.\nHoe oud is de leiding? Raad de juiste leeftijd van de leid(st)er.\nSchrijf een elfje (elf woorden op vijf dichtregels: 1-2-3-4-1).\nEet om het eerste drie beschuiten op en fluit het liedje ‘Broeder Jakob’.\nSchat één minuut juist in.\nLeg met je tenen een knoop in een touw.\nSlijp een potlood tot er niets meer overblijft.\nZoek voor alle letters in het alfabet een jongens- of meisjesnaam.\nLos een rebus op.\nZing drie liedjes waar het woord liefde in voorkomt.\nZeg het alfabet achterstevoren op.\nRijg een touw door je kleren en dat van je medespelers: je begint bij je hals, het touw komt er aan je voeten weer uit en gaat langs de broekspijp van je buur naar zijn of haar hals, enz.\nMaak een cartoon van elk van je medespelers.\nDe leiding moet kunnen raden wie het is.\nPraat een minuut over een brooddoos.\nJe mag geen ‘euh’ zeggen.\nVerzin een liedje op een bekende melodie.\nGa met de hele groep op één stoel staan.\nSchrijf een liefdesbrief naar de leiding.\nBreng de leiding aan het lachen.\nZet een stok recht op de grond.\nZet je voorhoofd tegen de stok.\nDraai tien rondjes en probeer over de stok te springen.\nSchil een aardappel in één lange schil.\nZeg zo lang mogelijk ‘AAA’.\nJe mag geen adem halen.\nZoek een schat op het terrein.\nJe krijgt daarvoor een schatkaart.\nVerzamel euromuntjes uit acht verschillende landen.\nTel exact tweehonderd rijstkorrels.\nGorgel een liedje.\nDe leiding moet het kunnen raden.\nBedenk vijf spreekwoorden over het weer.\nZoek 25 groene voorwerpen.\nDoe een blinddoek aan, draai tien rondjes en probeer nu naar de overkant van het terrein te stappen.\nBind een touw rond je middel met daaraan een balpen geknoopt.\nZorg dat de pen net onder je knieën hangt.\nProbeer de pen in een flesje te krijgen.\nJe mag je handen niet gebruiken.\nGa met je voeten tegen elkaar staan.\nLeg een koekje op je voet.\nProbeer dat koekje zo snel mogelijk op te eten.\nJe mag je handen niet gebruiken.\nGeraak geblinddoekt door een doolhof.\nJe medespelers mogen helpen.\nBreng met een spons het water van de ene emmer naar een andere over.\nKnoop twee meter gekookte spaghettislierten aan elkaar.\nLeg een parcours af met een knikker op een lepel in je mond.\nMaak een levende piramide van minstens vier verdiepingen.\nBlaas een ballon op, laat hem (zonder dat je hem knoopt) los en vang hem weer op.\nVertaal een zin in drie verschillende talen.\nGa in een cirkel staan en geef een sinaasappel door.\nJe moet hem tussen je kin en nek klemmen en je mag je handen niet gebruiken.\nWerp vanop twee meter afstand twintig kroonkurken in een schaaltje.\nHerken geblinddoekt een aantal smaken: mosterd, citroen, suiker, enz.\nMastermind.\nKraak de code van de leiding.\nSchrijf met letters uit een krant: “Dit is het allerbeste spel ooit!”\nHaal om het eerste een draad door het oog van een naald.\nDans per twee een slow terwijl jullie elk het uiteinde van een spaghettistokje in je mond houden.\nHet duo dat het langst kan slowen zonder dat hun stokje breekt, wint.\nVerzamel zoveel personen dat de som van hun schoenmaten exact 200 is.\nPuzzel een in stukken geknipte foto in elkaar.\nZeg tien keer na elkaar ‘de kat krabt de krollen van de trap’.\nJe mag geen fouten maken.\nVertel een verhaal in de p-taal.\nElke klinker herhaal je met een P ertussen.\n‘Daan gaat naar zee’ wordt dus: daa-p-aan gaa-p-aat naa-p-aar de-p-e zee-p-ee.\nRen om het snelst achterwaarts het spelterrein over.\nNeem een stuk touw van drie meter.\nAan de ene kant maak je een autootje vast, de andere kant bind je aan een potlood.\nRol je touw nu zo snel mogelijk op.\nWelk autootje wint de race?\nStop zoveel mogelijk letterkoekjes in je mond.\nJe mag niet knabbelen.\nSchrijf op elk blad van een rol wc-papier een andere meisjesnaam.\nBouw een kaartenhuisje van vier verdiepingen.\nBedenk een raadsel voor de leiding.\nBlaas een ballon op tot hij ontploft.\nVoeder je medespeler geblinddoekt een potje aardbeienyoghurt.\nBalanceer een bezemsteel gedurende tien seconden op je kin.\nVouw een vlieger en gooi hem verder dan de vlieger van de leiding.\nEet een boterham met choco op zonder je handen te gebruiken.\nRaad geblinddoekt welke voeten van welke tegenspelers zijn.\nMaak zo snel mogelijk een ballon kapot die in een boom hangt.\nVerzin een smurfennaam voor alle spelers uit je groep.\nKnoop geblinddoekt je schoenen dicht.\nJe medespeler gooit een aardappel.\nJij moet hem vangen met een vork.\nRangschik de namen van alle spelers in alfabetische volgorde.\nLaat een ijsblokje smelten zodat je de knikker eruit kan halen.\nEet om het eerst een bord gekookte rijst leeg met eetstokjes.\nVorm met je ploeg het woord ‘superformidabel’.\nMaak je schoen los.\nProbeer hem zo uit te schoppen dat hij op de tafel landt.\nJe moet op twee meter van de tafel staan.\nRijg zoveel mogelijk macaroni op een spaghettistokje.\nJe mag het spaghettistokje enkel met je mond aanraken.\nVerplaats een speelkaart naar de overkant van het speelterrein.\nDoe dat door ze met een rietje vast te zuigen, je mag ze niet aanraken.\nHoud drie ballonnen gedurende een minuut in de lucht zonder ze vast te houden.\nBlaas een zeepbel en zorg dat die door de hoepel zweeft die iemand van de leiding omhoog houdt.\nBlaas in één adem twintig verjaardagskaarsjes uit.\nGa met je medespelers in een kring zitten.\nSluit jullie ogen en probeer samen tot twintig te tellen door elk één nummer te zeggen.\nJullie mogen geen volgorde afspreken.\nSpreken twee spelers tegelijk, dan begin je opnieuw.\nScheer een ballon zonder dat hij springt.\nSchrijf je naam met je grote teen in verf gedoopt.\nMaak een klerenketting van vijftien meter.\nBekijk gedurende een halve minuut twintig voorwerpen.\nDaarna worden ze bedekt.\nSom er minstens vijftien op.\nJe mag een minuut lang niet met je ogen knipperen.\nAlle spelers van je groep doen hun schoenen uit en gooien die op een hoop.\nDaarna doe je een blinddoek om en draai je tien toertjes om je as.\nProbeer nu zo snel mogelijk je eigen schoenen opnieuw aan te doen.\nZoek vijf plaatsnamen waar een dier in voorkomt (Mol, Beveren, De Haan, Beersel, Beernem, Gierle, enz.).\nMaak een foto met een optische illusie (bv. raak de top van de kerktoren aan).\nOrganiseer een flashmob, zorg dat zoveel mogelijk mensen meedansen.\nMaak een regenboog na met sokken.\nRangschik je groep op aantal TikTok-volgers.\nVind de kookwekker voor hij afgaat.\nZorg dat je helemaal in het rood gekleed bent.\nTel hoeveel keer het woord ‘fee’ voorkomt in het sprookje over Doornroosje.\nLeer de leiding een spelletje dat ze nog niet kennen.\nOvertref de leiding in een uitdaging die je zelf mag kiezen.\nSchrijf een mooie boodschap op een kaartje voor de buren.\nKruip drie keer onder de tafel door.\nJe mag de grond niet raken.\nVorm met je ploeg een levend kunstwerk.\nKnip de coupons",
      tags: {
        connectOrCreate: [
          { where: { tag: "Buiten" }, create: { tag: "Buiten" } },
          { where: { tag: "9-10 jaar" }, create: { tag: "9-10 jaar" } }
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
