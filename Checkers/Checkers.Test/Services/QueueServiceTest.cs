﻿using Checkers.Models;
using Checkers.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using Xunit;

namespace Checkers.Test.Services
{
    public class QueueServiceTest
    {
        [Fact]
        ///Create two threads and assert they both get equal IDs
        public void QueueGameTest()
        {
            QueueService queueService = new QueueService();

            Guid id1 = Guid.Empty;
            Guid id2 = Guid.Empty;

            var t1 = new Thread(() =>
            {
                id1 = queueService.MatchGame();
            });

            var t2 = new Thread(() =>
            {
                id2 = queueService.MatchGame();
            });

            t1.Start();
            t2.Start();
            t1.Join(50);
            t2.Join(50);

            Assert.NotEqual(id1, Guid.Empty);
            Assert.NotEqual(id2, Guid.Empty);
            Assert.Equal(id1, id1);
        }

        [Fact]
        ///Create a thead and assert that it waits on the queue
        public void QueueWaitTest()
        {
            QueueService queueService = new QueueService();

            var t1 = new Thread(() =>
            {
                queueService.MatchGame();
            });
            t1.Start();

            int i = 0;
            while(!t1.ThreadState.Equals(ThreadState.WaitSleepJoin))
            {
                i++;
                Thread.Sleep(1);
                if (i > 100)
                {
                    Assert.True(false, "Hit timeout, thread not waiting");
                }
            }
        }


    }
}
