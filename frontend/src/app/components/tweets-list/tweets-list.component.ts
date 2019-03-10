import { Component, OnInit } from '@angular/core';
import { TweetsService } from '../../services/tweets.service';
import { Itweet } from '../../model/Itweet';
import { INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser/src/browser';
@Component({
  selector: 'app-tweets-list',
  templateUrl: './tweets-list.component.html',
  styleUrls: ['./tweets-list.component.css'],
  providers: [TweetsService]
})
export class TweetsListComponent implements OnInit {

  public tweets: any[] = [];
  constructor(private _tweetService: TweetsService) { }

  ngOnInit() {
    this.fetchTweets()
  }

  fetchTweets() {
    this._tweetService.getTweets().subscribe(
      // console.log(data)
      data => {
        for (var i = 0; i < data.length; i++) {
          this.tweets[i] = new Itweet()
          this.tweets[i].id = data[i]["_id"]
          this.tweets[i].created_at = data[i]["created_at"].replace('+0000','');
          this.tweets[i].text = data[i]["text"]
        }

        console.log(data);

      },
      error => {
        console.log(error);
      }
    )
  }

}
