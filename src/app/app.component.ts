import { Component, ViewContainerRef, ViewEncapsulation, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FacebookService, UIParams, UIResponse, InitParams} from 'ngx-facebook';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('showAnimate', [
      state('come', style({
        transform: 'translateX(0)'
      })),
      state('go', style({
        transform: 'translateX(300%)'
      })),
      transition('come => go', animate('0.5s'))
    ]),
    trigger('progAnimate', [
      state('come', style({
        transform: 'translateX(-300%)'
      })),
      state('go', style({
        transform: 'translateX(0%)'
      })),
      transition('come => go', animate('0.5s'))
    ])
  ]
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private fb: FacebookService) {
    const initParams: InitParams = {
      appId: '808394606188085',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }
  // myControl = new FormControl();
  wishList = [];
  options: string[] = [];
  category = 'all';
  from = 1;
  defaultzip: string;
  displaySwitch = 0;
  detailSwitch = 0;
  progSwitch = 0;
  wishSwitch = 0;
  preDisplay = 0;
  preWish = 0;
  allitems = [];
  items = [];
  totalPage: number;
  currentPage: number;
  itemDetail: any;
  itemDetailFromAll: object;
  currentDetail: number;
  visible = false;
  visibleAnimate = false;
  title: string;
  photos = [];
  similar = [];
  similarShow = [];
  similarDefault = [];
  moreSwitch: number;
  sortMethod: string;
  sortEnding: string;
  boxState = 'come';
  detailState = 'come';
  wishState = 'come';
  progState = 'go';
  innerWidth: any;
  ngOnInit(): void {
    this.http.get('http://ip-api.com/json')
      .subscribe(data => {
        const str = JSON.parse(JSON.stringify(data));
        console.log(str.zip);
        this.defaultzip = str.zip;
      });
    this.innerWidth = window.innerWidth;
  }
  searchZip(zip) {
    console.log(zip);
    this.http.get('https://zzncs571hw8.appspot.com/detail?zipcode=' + zip)
      .subscribe(data => {
        console.log(data);
        const zipcode = JSON.parse(JSON.stringify(data)).postalCodes;
        this.options = [];
        for (const z of zipcode) {
          this.options.push(z.postalCode);
        }
      });
  }
  openModal(): void {
    this.visible = true;
    this.visibleAnimate = true;
  }

  closeModal(): void {
    this.visibleAnimate = false;
    this.visible = false;
  }
  onSubmit(value) {
    this.detailSwitch = 0;
    this.displaySwitch = 0;
    this.progSwitch = 1;
    this.wishSwitch = 0;
    // value.defaultzip = defaultzip;
    this.http.get('https://zzncs571hw8.appspot.com/users', {params: value})
      .subscribe(data => {
        // console.log(value);
        console.log(data);
        const displayItems = JSON.parse(JSON.stringify(data));
        this.allitems = [];
        this.items = [];
        if (displayItems.findItemsAdvancedResponse[0].searchResult[0].item) {
          this.allitems = displayItems.findItemsAdvancedResponse[0].searchResult[0].item;
          for (let i = 0; i < Math.min(10, this.allitems.length); i++) {
            this.items.push(this.allitems[i]);
          }
        }
        this.totalPage = Math.ceil(this.allitems.length / 10);
        this.currentPage = 1;
        this.displaySwitch = 1;
        this.detailSwitch = 0;
        this.progSwitch = 0;
      }, err => {
        console.error('ERROR', err);
      });
  }
  clearAll() {
    this.displaySwitch = 0;
    this.detailSwitch = 0;
    this.wishSwitch = 0;
    this.from = 1;
    this.items = [];
    this.ngOnInit();
  }
  changePage(pageNum) {
    this.currentPage = pageNum;
    this.items = [];
    for (let i = 10 * (this.currentPage - 1); i < Math.min(10 * this.currentPage, this.allitems.length); i ++) {
      this.items.push(this.allitems[i]);
    }
  }
  showDetail(itemId, fromAll) {
    this.progSwitch = 1;
    this.progState = 'come';
    setTimeout(() => {
      this.progState = 'go';
      this.boxState = 'go';
      this.wishState = 'go';
    }, 300);
    setTimeout( () => {
    this.preDisplay = this.displaySwitch;
    this.preWish = this.wishSwitch;
    this.displaySwitch = 0;
    this.detailSwitch = 0;
    this.wishSwitch = 0;
    this.itemDetailFromAll = fromAll;
    this.sortMethod = '1';
    this.sortEnding = '1';
    this.http.get('https://zzncs571hw8.appspot.com/detail?itemId=' + itemId)
      .subscribe(data => {
        console.log(data);
        const dt = JSON.parse(JSON.stringify(data));
        this.itemDetail = dt.Item;
        this.title = dt.Item.Title;
        this.currentDetail = 1;
        this.progSwitch = 0;
        this.detailSwitch = 1;
        this.boxState = 'come';
        this.wishState = 'come';
        // this.progState = 'come';
        this.http.get('https://zzncs571hw8.appspot.com/detail?title=' + this.title)
          .subscribe(data1 => {
            console.log(data1);
            const dt1 = JSON.parse(JSON.stringify(data1));
            this.photos = [];
            this.photos = dt1.items;
          }, err => {
            console.error('ERROR', err);
          });
        this.http.get('https://zzncs571hw8.appspot.com/detail?similar=' + itemId)
          .subscribe(data2 => {
            console.log(data2);
            const dt2 = JSON.parse(JSON.stringify(data2));
            this.similar = [];
            // this.similarDefault = dt2.getSimilarItemsResponse.itemRecommendations.item;
            if (dt2.getSimilarItemsResponse.itemRecommendations.item) {
              this.similar = dt2.getSimilarItemsResponse.itemRecommendations.item;

              for (const it of this.similar) {
                this.similarDefault.push(it);
              }
              this.similarShow = [];
              this.moreSwitch = 0;
              for (let i = 0; i < Math.min(5, this.similar.length); i++) {
                this.similarShow.push(this.similar[i]);
              }
            }
          }, err => {
            console.error('ERROR', err);
          });
      }, err => {
        console.error('ERROR', err);
      });
    }, 1000);
    // this.http.get('https://zzncs571hw8.appspot.com/detail?title=' + this.title)
    //   .subscribe(data => {
    //     console.log(data);
    //     const dt = JSON.parse(JSON.stringify(data));
    //     this.photos = [];
    //     this.photos = dt.items;
    //   }, err => {
    //     console.error('ERROR', err);
    //   });
  }
  showMore(flag) {
    this.moreSwitch = flag;
    this.similarShow = [];
    if (flag === 0) {
      for (let i = 0; i < Math.min(5, this.similar.length); i ++) {
        this.similarShow.push(this.similar[i]);
      }
    } else {
      for (const i of this.similar) {
        this.similarShow.push(i);
      }
    }
  }
  changeDetail(pageNum) {
    this.currentDetail = pageNum;
  }
  gobackList() {
    this.progSwitch = 1;
    this.progState = 'come';
    setTimeout(() => {
      this.progState = 'go';
      this.detailState = 'go';
    }, 300);
    setTimeout(() => {
      this.displaySwitch = this.preDisplay;
      this.wishSwitch = this.preWish;
      this.detailSwitch = 0;
      this.detailState = 'come';
      this.progState = 'go';
      this.progSwitch = 0;
    }, 1000);
  }
  goToItem() {
    this.progSwitch = 1;
    this.progState = 'come';
    setTimeout(() => {
      this.progState = 'go';
      this.boxState = 'go';
      this.wishState = 'go';
    }, 300);
    setTimeout(() => {
      this.preWish = this.wishSwitch;
      this.preDisplay = this.displaySwitch;
      this.wishSwitch = 0;
      this.displaySwitch = 0;
      this.detailSwitch = 1;
      this.progState = 'go';
      this.boxState = 'come';
      this.wishState = 'come';
      this.progSwitch = 0;
    }, 1000);
  }
  getDaysLeft(dl) {
    const reg: RegExp = /P\d+D/;
    const result = reg.exec(dl)[0];
    return result.slice(1, -1);
  }
  onChange() {
    console.log(this.sortMethod);
    console.log(this.sortEnding);
    console.log(typeof this.sortMethod);
    if (this.sortMethod === '1') {
      this.similar = [];
      for (const it of this.similarDefault) {
        this.similar.push(it);
      }
    } else if (this.sortMethod === '2') {
      this.similar.sort((a, b) => {
        return (a.title < b.title) ? -parseInt(this.sortEnding, 10) : parseInt(this.sortEnding, 10) ;
      });
    } else if (this.sortMethod === '3') {
      this.similar.sort((a, b) => {
        return (parseInt(this.getDaysLeft(a.timeLeft), 10)
          < parseInt(this.getDaysLeft(b.timeLeft), 10)) ?
          -parseInt(this.sortEnding, 10) : parseInt(this.sortEnding, 10);
      });
    } else if (this.sortMethod === '4') {
      this.similar.sort((a, b) => {
        return (parseFloat(a.buyItNowPrice.__value__) < parseFloat(b.buyItNowPrice.__value__)) ?
          -parseInt(this.sortEnding, 10) : parseInt(this.sortEnding, 10);
      });
    } else if (this.sortMethod === '5') {
      this.similar.sort((a, b) => {
        return (parseFloat(a.shippingCost.__value__) < parseFloat(b.shippingCost.__value__)) ?
          -parseInt(this.sortEnding, 10) : parseInt(this.sortEnding, 10);
      });
    }
    this.showMore(this.moreSwitch);
  }
  fbShare() {
    // const params: UIParams = {
    //   href: this.itemDetail.ViewItemURLForNaturalSearch,
    //   method: 'share',
    //   quote: 'Buy ' +  this.itemDetail.Title + ' at $' + this.itemDetail.CurrentPrice.Value + ' from link below',
    // };
    //
    // this.fb.ui(params)
    //   .then((res: UIResponse) => console.log(res))
    //   .catch((e: any) => console.error(e));
    const quote = 'Buy ' +  this.itemDetail.Title + ' at $' + this.itemDetail.CurrentPrice.Value + ' from link below';
    window.open('http://www.facebook.com/sharer.php?&u=' + encodeURI(this.itemDetail.ViewItemURLForNaturalSearch) + '&quote='
      + quote, '_blank');
  }
  cutTitle(title: string) {
    if (title.length < 30) {
      return title;
    }
    let i = 30;
    while (i > 0) {
      if (title[i] === ' ') {
        break;
      }
      i -= 1;
    }
    return title.slice(0, i) + '...';
  }
  addToWishList(i) {
    this.wishList.push(i);
  }
  removeWishList(i) {
    const index = this.wishList.indexOf(i);
    this.wishList.splice(index, 1);
  }
  totalShopping() {
    let sum = 0;
    for (const item of this.wishList) {
      sum += parseFloat(item.sellingStatus[0].currentPrice[0].__value__);
    }
    return sum.toFixed(2);
  }
}


