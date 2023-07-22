import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://upload.wikimedia.org/wikipedia/commons/8/8f/Cooper_Hewitt_%2848059131921%29.jpg',
      20000,
      new Date('2019-01-01'),
      new Date('2019-12-31')
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris.',
      'https://www.casadevalentina.com.br/wp-content/uploads/2021/04/APARTAMENTO-CLASSICO-PARISIENSE_MARCELORUDUIT_CASADEVALENTINA_DIVULGACAO-9-900x601.jpg.optimal.jpg',
      3000,
      new Date('2021-04-04'), 
      new Date('2021-04-05')

    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not you average city trip.',
      'https://favim.com/orig/201106/28/castle-fog-foggy-hawarden-castle-mist-Favim.com-86047.jpg',
      1199,
      new Date('2022-06-06'), 
      new Date('2022-06-08')
    ),
  ];

  get places() {
    return [...this._places];
  }
  constructor() {}

  getPlace(id: string): Place {
    const foundPlace = this._places.find((p) => p.id === id);
    if (foundPlace) {
      return foundPlace;
    } else {
      return {
        id: '', // Provide a default value for id
        title: '',
        description: '',
        imageUrl: '',
        price: 0,
        availableFrom: new Date(), // Provide a default Date value for availableFrom
        availableTo: new Date(),
        
      };
    }
  }
}
