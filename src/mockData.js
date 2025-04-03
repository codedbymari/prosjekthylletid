// mockData.js
export const generateMockData = () => {
    const today = new Date();
    
    const getRelativeDate = (daysDiff) => {
      const date = new Date(today);
      date.setDate(date.getDate() + daysDiff);
      return date.toISOString();
    };
    
    return [
      { 
        id: 1, 
        title: 'Sjøfareren', 
        author: 'Erika Fatland', 
        borrower: {
          id: 'N00123456',
          name: 'Ole Nordmann',
          email: 'ole.nordmann@example.com',
          phone: '91234567'
        },
        reservedDate: getRelativeDate(-5),
        readyDate: getRelativeDate(-4),
        pickedUpDate: getRelativeDate(-2),
        status: 'HENTET',
        pickupNumber: 'A-123',
        createdAt: getRelativeDate(-6),
        updatedAt: getRelativeDate(-2)
      },
      { 
        id: 2, 
        title: 'Lur familiemat', 
        author: 'Ida Gran-Jansen', 
        borrower: {
          id: 'N00234567',
          name: 'Kari Nordmann',
          email: 'kari.nordmann@example.com',
          phone: '92345678'
        },
        reservedDate: getRelativeDate(-7),
        readyDate: getRelativeDate(-6),
        pickedUpDate: getRelativeDate(-3),
        status: 'HENTET',
        pickupNumber: 'A-124',
        createdAt: getRelativeDate(-8),
        updatedAt: getRelativeDate(-3)
      },
      { 
        id: 3, 
        title: 'Råsterk på et år', 
        author: 'Jørgine Massa Vasstrand', 
        borrower: {
          id: 'N00345678',
          name: 'Petter Hansen',
          email: 'petter.hansen@example.com',
          phone: '93456789'
        },
        reservedDate: getRelativeDate(-3),
        readyDate: getRelativeDate(-2),
        pickedUpDate: null,
        status: 'VENTER',
        pickupNumber: 'A-125',
        createdAt: getRelativeDate(-4),
        updatedAt: getRelativeDate(-2)
      },
      { 
        id: 4, 
        title: 'Tørt land', 
        author: 'Jørn Lier Horst', 
        borrower: {
          id: 'N00456789',
          name: 'Marte Kirkerud',
          email: 'marte.kirkerud@example.com',
          phone: '94567890'
        },
        reservedDate: getRelativeDate(-5),
        readyDate: getRelativeDate(-4),
        pickedUpDate: getRelativeDate(-3),
        status: 'HENTET',
        pickupNumber: 'A-126',
        createdAt: getRelativeDate(-6),
        updatedAt: getRelativeDate(-3)
      },
      { 
        id: 5, 
        title: 'Kongen av Os', 
        author: 'Jo Nesbø', 
        borrower: {
          id: 'N00567890',
          name: 'Lars Holm',
          email: 'lars.holm@example.com',
          phone: '95678901'
        },
        reservedDate: getRelativeDate(-3),
        readyDate: getRelativeDate(-2),
        pickedUpDate: null,
        status: 'VENTER',
        pickupNumber: 'A-127',
        createdAt: getRelativeDate(-4),
        updatedAt: getRelativeDate(-2)
      },
      { 
        id: 6, 
        title: '23 meter offside (Pondus)', 
        author: 'Frode Øverli', 
        borrower: {
          id: 'N00678901',
          name: 'Sofia Berg',
          email: 'sofia.berg@example.com',
          phone: '96789012'
        },
        reservedDate: getRelativeDate(-8),
        readyDate: getRelativeDate(-7),
        pickedUpDate: getRelativeDate(-6),
        status: 'HENTET',
        pickupNumber: 'A-128',
        createdAt: getRelativeDate(-9),
        updatedAt: getRelativeDate(-6)
      },
      { 
        id: 7, 
        title: 'Felix har følelser', 
        author: 'Charlotte Mjelde', 
        borrower: {
          id: 'N00789012',
          name: 'Erik Lund',
          email: 'erik.lund@example.com',
          phone: '97890123'
        },
        reservedDate: getRelativeDate(-1),
        readyDate: getRelativeDate(0), // Today
        pickedUpDate: null,
        status: 'VENTER',
        pickupNumber: 'A-129',
        createdAt: getRelativeDate(-2),
        updatedAt: getRelativeDate(0)
      },
      { 
        id: 8, 
        title: 'Skriket', 
        author: 'Jørn Lier Horst og Jan-Erik Fjell', 
        borrower: {
          id: 'N00890123',
          name: 'Anna Dahl',
          email: 'anna.dahl@example.com',
          phone: '98901234'
        },
        reservedDate: getRelativeDate(-6),
        readyDate: getRelativeDate(-5),
        pickedUpDate: getRelativeDate(-4),
        status: 'HENTET',
        pickupNumber: 'A-130',
        createdAt: getRelativeDate(-7),
        updatedAt: getRelativeDate(-4)
      },
      { 
        id: 9, 
        title: 'Juleroser', 
        author: 'Herborg Kråkevik', 
        borrower: {
          id: 'N00901234',
          name: 'Thomas Olsen',
          email: 'thomas.olsen@example.com',
          phone: '99012345'
        },
        reservedDate: getRelativeDate(-10),
        readyDate: getRelativeDate(-9),
        pickedUpDate: null,
        status: 'UTLØPT',
        pickupNumber: 'A-131',
        createdAt: getRelativeDate(-11),
        updatedAt: getRelativeDate(-1)
      },
      { 
        id: 10, 
        title: 'Søvngjengeren', 
        author: 'Lars Kepler', 
        borrower: {
          id: 'N00012345',
          name: 'Maria Johansen',
          email: 'maria.johansen@example.com',
          phone: '90123456'
        },
        reservedDate: getRelativeDate(-4),
        readyDate: getRelativeDate(-3),
        pickedUpDate: null,
        status: 'VENTER',
        pickupNumber: 'A-132',
        createdAt: getRelativeDate(-5),
        updatedAt: getRelativeDate(-3)
      },
    ];
  };