import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place?: Place;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCrtl: ModalController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      if (placeId) {
        this.place = this.placesService.getPlace(placeId);
      }
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.modalCrtl
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
        },
        
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss();
      })
      .then((resultData:any) => {
        if (resultData !== undefined && resultData !== null) {
          console.log(resultData.data);
          if (resultData.role === 'confirm') {
            console.log('BOOKED!');
          }
        } else {
          console.log('Error: Promise did not resolve to a defined value.');
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
      
  }
}
