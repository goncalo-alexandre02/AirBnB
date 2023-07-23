import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place!: Place;
  isBookable = false;
  private placeSub!: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId');
      if (!placeId) {
        // Handle the case when placeId is not available
        return;
      }
      this.placeSub = this.placesService
        .getPlace(placeId)
        .subscribe((placeData) => {
          this.place = {
            id: placeData.id ?? '', // Use nullish coalescing to provide a default value if it's undefined
            title: placeData.title ?? '',
            description: placeData.description ?? '',
            imageUrl: placeData.imageUrl ?? '',
            price: placeData.price ?? 0, // Provide a default value for price, use 0 or any other default value based on your use case
            availableFrom: placeData.availableFrom ?? new Date(),
            availableTo: placeData.availableTo ?? new Date(),
            userId: placeData.userId ?? '',
          };
         this.isBookable = this.place.userId !== this.authService.userId;

        });
    });
  }

  onBookPlace() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log('Mode:', mode); // Check if the method is being called and the correct mode is passed
  
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEl) => {
        
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
  
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Booking place...' })
            .then((loadingEl) => {
              loadingEl.present(); // Show the loading controller
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  console.log('Booking complete'); // Check if booking is complete
                  loadingEl.dismiss(); // Dismiss the loading controller when the booking is done
                });
            });
        }
      });
  }
  

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
