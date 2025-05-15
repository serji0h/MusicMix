import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicPlayerPage } from './music-player.page';

describe('MusicPlayerPage', () => {
  let component: MusicPlayerPage;
  let fixture: ComponentFixture<MusicPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
