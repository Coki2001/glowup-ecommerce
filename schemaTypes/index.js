export const schemaTypes = [
  {
    name: 'product',
    title: 'Proizvodi',
    type: 'document',
    fields: [
      { name: 'title', title: 'Naziv', type: 'string' },
      { name: 'price', title: 'Cena (RSD)', type: 'number' },
      { name: 'description', title: 'Opis', type: 'text' },
      { 
        name: 'image', 
        title: 'Slika', 
        type: 'image', 
        options: { hotspot: true } 
      }
    ]
  }
]