
const addressCoordinate = new Map([
    ['5 Queen Street, Rosebery NSW', '-33.91424995994116, 151.20197683110007'], //first place for bigger zone track
    ['37 Morley Avenue, Rosebery', '-33.91526735672386, 151.20100414755677'],
    ['1-3 Church Street, North Willoughby Willoughby', '-33.79541241710087, 151.19603570240574'],
    ['243 Raglan Street, Mosman','-33.82737978370444, 151.2504224520614'],
    ['61-65 Macarthur Street, Ultimo','-33.87989955348729, 151.19842257342904'],
    ['464 Military Road, Mosman', '-33.825635352916436, 151.23247022322656'],
    ['3 Gladstone Parade, Lindfield', '-33.77916204481984, 151.16840424883293'],
    ['7A Ivy Street, Darlington', '-33.890907766322094, 151.19564640262158'],
    ['52-54 McEvoy Street, Waterloo', '-33.9017210432018, 151.20247048752847'],
    ['174-176 Victoria Street, Beaconsfield','-33.912238576626336, 151.20039818426045'],
    ['293-297 Abercrombie Street, Darlington', '-33.89140185331937, 151.19445375335928'],
    ['1 Metters Street, Erskineville', '-33.90328391947936, 151.18688984077897'],
    ['5 Milford Street, Randwick', '-33.91584932681331, 151.24381269426345'],
    ['30 Buckland Street, Chippendale', '-33.886295069708964, 151.19745113677757'],
    ['28 Wycombe Road, Neutral Bay', '-33.840821255850436, 151.2206726524336'],
    ['27 The Esplanade, Mosman', '-33.825816186383065, 151.2509144494878'],
    ['28 Pelican Street, Surry Hills', '-33.87904990815486, 151.2130861295196'],
    ['349 Sailors Bay Road, Northbridge', '-33.81190336922901, 151.21945663863193'],
    ['161 Queen Street, Beaconsfield', '-33.912664977834964, 151.1997912729632'],
    ['1-25 Adelaide Street, Surry Hills', '-33.88692407343761, 151.2110001479261'],
    ['31-33 New Canterbury Road, Petersham', '-33.89591146385485, 151.1544371619071'],
    ['15 Doody Street, Alexandria', '-33.91684503249882, 151.19745761188074'],
    ["29-31 O'Riordan Street, Alexandria", '-33.91053072159202, 151.19756202273766'],
    ['56 Victoria Street, McMahons Point', '-33.84318462918004, 151.20390051383765'],
    ['Level 1, 483 Riley St, Surry Hills', '-33.88774674047073, 151.21182587832536'],
    ['52 Victoria Street, McMahons Point', '-33.843238311983356, 151.20372731704924'],
    ['35-39 Bourke Road, Alexandria', '-33.90981900806236, 151.1941733426122'],
    ['17 Foster Street, Surry Hills', '-33.87960120414443, 151.21007828592124'],
    ['406/77 Dunning Avenue, Rosebery', '-33.9155623926012, 151.20273169483477'],
    ['68-70 Dixon Street, Haymarket', '-33.87844337452941, 151.20418171993592'],
    ['87 The Boulevarde, Dulwich Hill NSW', '-33.90048470159129, 151.14356505842375'],


]);
module.exports = {
    coordinates: function() {
        return addressCoordinate
    }
}

// const address = [
//     new Map([
//         ['North Willoughby', 'Church Street'],
//         ['North Willoughby', 'Sydney Street'],
//         ['North Willoughby', 'Penshurst Street']
//     ]),

//     new Map([
//         ['Mosman', 'Raglan Street'],
//         ['Mosman', 'Military Road'],
//         ['Mosman', 'The Esplanade']
//     ]),

//     new Map([
//         ['Ultimo', 'MacArthur Street']
//     ]),

//     new Map([
//         ['Lindfield', 'Gladstone Parade']
//     ]),

//     new Map([
//         ['Darlington', 'Ivy Street'],
//         ['Darlington', 'Lander Street'],
//         ['Darlington', 'Abercrombie Street'],
//         ['Darlington', 'Shepherd Lane']
//     ]),

//     new Map([
//         ['Rosebery', 'Morley Avenue'],
//         ['Rosebery', 'Dunninng Avenue']
//     ]),

//     new Map([
//         ['Waterloo', 'McEvoy Street']
//     ]),

//     new Map([
//         ['Beaconsfield', 'Victoria Street'],
//         ['Beaconsfield', 'Queen Street']
//     ]),

//     new Map([
//         ['Erskineville', 'Metters Street']
//     ]),

//     new Map([
//         ['Randwick', 'Milford Street']
//     ]),

//     new Map([
//         ['Chippendale', 'Buckland Street']
//     ]),

//     new Map([
//         ['Neutral Bay', 'Wycombe Road']
//     ]),

//     new Map([
//         ['Surry Hills', 'Pelican Street'],
//         ['Surry Hills', 'Riley St'],
//         ['Surry Hills', 'Adelaide Street'],
//         ['Surry Hills', 'Foster Street']
//     ]),

//     new Map([
//         ['Northbridge', 'Sailors Bay Road']
//     ]),

//     new Map([
//         ['Petersham', 'New Canterbury Road'],
//         ['Petersham', 'Audley Street']
//     ]),

//     new Map([
//         ['Alexandria', 'Doody Street'],
//         ['Alexandria', "O'Riordan Street"]
//     ]),

//     new Map([
//         ['McMahons Point', 'Victoria Street']
//     ]),

//     new Map([
//         ['Alexandria', 'Bourke Road']
//     ]),

//     new Map([
//         ['Haymarket', 'Dixon Street']
//     ]),

//     new Map([
//         ['Dulwich Hill', 'The Boulevarde']
//     ])
// ]