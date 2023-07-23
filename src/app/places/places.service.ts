import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://upload.wikimedia.org/wikipedia/commons/8/8f/Cooper_Hewitt_%2848059131921%29.jpg',
      20000,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris.',
      'https://www.casadevalentina.com.br/wp-content/uploads/2021/04/APARTAMENTO-CLASSICO-PARISIENSE_MARCELORUDUIT_CASADEVALENTINA_DIVULGACAO-9-900x601.jpg.optimal.jpg',
      3000,
      new Date('2021-04-04'),
      new Date('2021-04-05'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not you average city trip.',
      'https://favim.com/orig/201106/28/castle-fog-foggy-hawarden-castle-mist-Favim.com-86047.jpg',
      1199,
      new Date('2022-06-06'),
      new Date('2022-06-08'),
      'abc'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }
  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/8/8f/Cooper_Hewitt_%2848059131921%29.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces)
      })
    );
  }
}
