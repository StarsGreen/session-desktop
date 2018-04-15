/**
 * @prettier
 */
import 'mocha';

import { assert } from 'chai';
import { shuffle } from 'lodash';

import {
  groupMessagesByDate,
  Section,
} from '../../../components/conversation/media-gallery/groupMessagesByDate';
import { Message } from '../../../components/conversation/media-gallery/propTypes/Message';

const toMessage = (date: Date): Message => ({
  received_at: date.getTime(),
  attachments: [],
});

describe('groupMessagesByDate', () => {
  it('should group messages', () => {
    const referenceTime = new Date('2018-04-12T18:00Z').getTime(); // Thu
    const input: Array<Message> = shuffle([
      // Today
      toMessage(new Date('2018-04-12T12:00Z')), // Thu
      toMessage(new Date('2018-04-12T00:01Z')), // Thu
      // This week
      toMessage(new Date('2018-04-11T23:59Z')), // Wed
      toMessage(new Date('2018-04-09T00:01Z')), // Mon
      // This month
      toMessage(new Date('2018-04-08T23:59Z')), // Sun
      toMessage(new Date('2018-04-01T00:01Z')),
      // March 2018
      toMessage(new Date('2018-03-31T23:59Z')),
      toMessage(new Date('2018-03-01T14:00Z')),
      // February 2011
      toMessage(new Date('2011-02-28T23:59Z')),
      toMessage(new Date('2011-02-01T10:00Z')),
    ]);

    const expected: Array<Section> = [
      {
        type: 'today',
        messages: [
          {
            received_at: 1523534400000,
            attachments: [],
          },
          {
            received_at: 1523491260000,
            attachments: [],
          },
        ],
      },
      {
        type: 'yesterday',
        messages: [
          {
            received_at: 1523491140000,
            attachments: [],
          },
        ],
      },
      {
        type: 'thisWeek',
        messages: [
          {
            received_at: 1523232060000,
            attachments: [],
          },
        ],
      },
      {
        type: 'thisMonth',
        messages: [
          {
            received_at: 1523231940000,
            attachments: [],
          },
          {
            received_at: 1522540860000,
            attachments: [],
          },
        ],
      },
      {
        type: 'yearMonth',
        year: 2018,
        month: 2,
        messages: [
          {
            received_at: 1522540740000,
            attachments: [],
          },
          {
            received_at: 1519912800000,
            attachments: [],
          },
        ],
      },
      {
        type: 'yearMonth',
        year: 2011,
        month: 1,
        messages: [
          {
            received_at: 1298937540000,
            attachments: [],
          },
          {
            received_at: 1296554400000,
            attachments: [],
          },
        ],
      },
    ];

    const actual = groupMessagesByDate(referenceTime, input);
    assert.deepEqual(actual, expected);
  });
});
