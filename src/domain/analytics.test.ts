import { describe, expect, it } from 'vitest'
import { classifyDevice, isBot, isTrackablePath, jobRefFromPath, percentChange, referrerHost, sourceName } from './analytics'

const android = 'Mozilla/5.0 (Linux; Android 14; SM-A146P) AppleWebKit/537.36 Chrome/128.0 Mobile Safari/537.36'
const tablet = 'Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 Chrome/128.0 Safari/537.36'
const desktop = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36'

describe('visitor classification', () => {
  it('detects devices', () => {
    expect(classifyDevice(android)).toBe('mobile')
    expect(classifyDevice(tablet)).toBe('tablet')
    expect(classifyDevice(desktop)).toBe('desktop')
  })

  it('excludes bots, link-preview fetchers and automated browsers', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBot('WhatsApp/2.23.20.0')).toBe(true)
    expect(isBot('Mozilla/5.0 HeadlessChrome/140.0')).toBe(true)
    expect(isBot(null)).toBe(true)
    expect(isBot(desktop)).toBe(false)
  })
})

describe('traffic sources', () => {
  it('ignores internal navigation and direct visits', () => {
    expect(referrerHost('https://joblinkuganda.co.ug/jobs', 'joblinkuganda.co.ug')).toBeNull()
    expect(referrerHost('', 'joblinkuganda.co.ug')).toBeNull()
    expect(referrerHost('not a url', 'x')).toBeNull()
  })

  it('names common Ugandan traffic sources', () => {
    expect(sourceName(referrerHost('https://www.google.co.ug/', 'site'))).toBe('Google')
    expect(sourceName('l.facebook.com')).toBe('Facebook')
    expect(sourceName('l.wl.co')).toBe('WhatsApp')
    expect(sourceName('t.co')).toBe('X (Twitter)')
    expect(sourceName(null)).toBe('Direct')
    expect(sourceName('brightermonday.co.ug')).toBe('brightermonday.co.ug')
  })
})

describe('paths', () => {
  it('extracts job references from job pages only', () => {
    expect(jobRefFromPath('/jobs/restaurant-supervisor-kampala-jl42')).toBe('42')
    expect(jobRefFromPath('/jobs/category/restaurant')).toBeNull()
  })

  it('only counts public pages', () => {
    expect(isTrackablePath('/jobs')).toBe(true)
    expect(isTrackablePath('/admin/collections/jobs')).toBe(false)
    expect(isTrackablePath('/api/users')).toBe(false)
    expect(isTrackablePath('/jobs?q=1')).toBe(false)
    expect(isTrackablePath('/<script>')).toBe(false)
  })
})

describe('percentChange', () => {
  it('compares with the previous period', () => {
    expect(percentChange(150, 100)).toBe(50)
    expect(percentChange(50, 100)).toBe(-50)
    expect(percentChange(5, 0)).toBeNull()
    expect(percentChange(0, 0)).toBe(0)
  })
})
