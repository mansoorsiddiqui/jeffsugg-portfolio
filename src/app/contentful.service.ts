import { Injectable } from '@angular/core';
import { createClient, Entry, AssetCollection, Asset } from 'contentful';

const CONFIG = {
  space: 'zpcq8iu0tb6c',
  accessToken: 'VvHkzHoTsPqG0IX1ccNLTWmhDIdZH3zuTmWPRrqJ5os',

  contentTypeIds: {
    project: 'project'
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken
  });

  constructor() { }

  getProjects(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.project
    }, query))
    .then(res => res.items);
  }

  getImages(query?: object): Promise<AssetCollection | Asset[]> {
    return this.cdaClient.getAssets(query)
    .then(res => res.items);
  }
}
