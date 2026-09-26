import { describe, expect, it } from 'vitest';
import {
  DEFAULT_VIEW_LAYER,
  getViewLayerParentSetting,
  getViewLayerSetting,
  viewLayerList,
  viewLayerSettings,
  viewSocialLayerList,
} from './config';

describe('getViewLayerSetting', () => {
  it('レイヤー名から設定を引ける', () => {
    expect(getViewLayerSetting('biz')).toEqual({
      layer: 'biz',
      path: '/biz',
    });
  });

  it('未知のレイヤーは undefined', () => {
    expect(getViewLayerSetting('nope')).toBeUndefined();
  });

  it('既定レイヤーは path を持たない', () => {
    expect(getViewLayerSetting(DEFAULT_VIEW_LAYER)).toEqual({
      layer: 'private',
    });
  });
});

describe('getViewLayerParentSetting', () => {
  it('親レイヤーの設定を返す', () => {
    expect(getViewLayerParentSetting('libe')).toEqual({ layer: 'private' });
    expect(getViewLayerParentSetting('facebook')).toEqual({
      layer: 'biz',
      path: '/biz',
    });
  });

  it('親を持たないレイヤーは undefined', () => {
    expect(getViewLayerParentSetting('private')).toBeUndefined();
    expect(getViewLayerParentSetting('biz')).toBeUndefined();
  });

  it('undefined を渡しても落ちずに undefined を返す', () => {
    expect(getViewLayerParentSetting(undefined)).toBeUndefined();
  });

  it('未知のレイヤーは undefined', () => {
    expect(getViewLayerParentSetting('nope')).toBeUndefined();
  });

  it('多段の親子関係を1段ずつ辿れる', () => {
    // test -> libe -> private
    expect(getViewLayerParentSetting('test')?.layer).toBe('libe');
    expect(getViewLayerParentSetting('libe')?.layer).toBe('private');
    expect(getViewLayerParentSetting('private')).toBeUndefined();
  });
});

describe('viewLayerList / viewSocialLayerList', () => {
  it('親を持たないレイヤーだけが viewLayerList に入る', () => {
    expect(viewLayerList).toEqual(['private', 'biz']);
  });

  it('親を持つレイヤーだけが viewSocialLayerList に入る', () => {
    expect(viewSocialLayerList).toEqual([
      'libe',
      'test',
      'facebook',
      'linkedin',
      'findy',
      'wantedly',
      'x',
      'qiita',
      'zenn',
      'extension',
    ]);
  });

  it('2つのリストは重複せず、全レイヤーを網羅する', () => {
    const all = [...viewLayerList, ...viewSocialLayerList];
    expect(new Set(all).size).toBe(all.length);
    expect(new Set(all)).toEqual(
      new Set(viewLayerSettings.map((setting) => setting.layer)),
    );
  });
});

describe('viewLayerSettings の整合性', () => {
  it('レイヤー名が重複していない', () => {
    const layers = viewLayerSettings.map((setting) => setting.layer);
    expect(new Set(layers).size).toBe(layers.length);
  });

  it('parentLayer は必ず存在するレイヤーを指す', () => {
    const layers = new Set(viewLayerSettings.map((setting) => setting.layer));
    for (const setting of viewLayerSettings) {
      if ('parentLayer' in setting && setting.parentLayer) {
        expect(layers).toContain(setting.parentLayer);
      }
    }
  });

  it('path は重複しない', () => {
    const paths = viewLayerSettings
      .map((setting) => ('path' in setting ? setting.path : undefined))
      .filter(Boolean);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('親子関係が循環していない', () => {
    for (const setting of viewLayerSettings) {
      const seen = new Set<string>([setting.layer]);
      let current = getViewLayerParentSetting(setting.layer)?.layer;
      while (current) {
        expect(seen).not.toContain(current);
        seen.add(current);
        current = getViewLayerParentSetting(current)?.layer;
      }
    }
  });
});
