import { EventData, Page } from '@nativescript/core';
import { HomeViewModel } from './view-models/home-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new HomeViewModel();
}