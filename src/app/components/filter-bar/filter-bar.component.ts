import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/model/model';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  public tagIds: string[] = [];
  public tagMap: { [id: string]: Tag } = {};

  private subscriptions: Subscription[] = [];

  constructor(public filter: FilterService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.filter.filteredTagIds.subscribe((tagIds: string[]) => {
        this.tagIds = tagIds;
      })
    );
    this.subscriptions.push(
      this.filter.filteredTagMap.subscribe((tagMap: { [id: string]: Tag }) => {
        this.tagMap = tagMap;
      })
    );
  }

  toggleTagFilter(tagId: string) {
    this.filter.toggleTagFilter(tagId);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
