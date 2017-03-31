import { InventoryPage } from './app.po';

describe('inventory App', () => {
  let page: InventoryPage;

  beforeEach(() => {
    page = new InventoryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
