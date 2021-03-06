﻿using Checkers.Models;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Checkers.DAL
{
    public class GameRepository
    {
        private static readonly GameRepository instance = new GameRepository();

        static GameRepository()
        {
        }
        private GameRepository()
        {
        }
        public static GameRepository Instance
        {
            get
            {
                return instance;
            }
        }

        private static Dictionary<Guid, Game> gameStore = new Dictionary<Guid, Game>();
        private static Dictionary<(Guid, Player), string> userStore = new Dictionary<(Guid, Player), string>();
        private static Dictionary<string, (Guid, Player)> userToGameIdStore = new Dictionary<string, (Guid, Player)>();


        [MethodImpl(MethodImplOptions.Synchronized)]
        public Game getGame(Guid gameId)
        {
            if (!gameStore.ContainsKey(gameId))
            {
                gameStore[gameId] = Game.CreateStartingGame();
            }

            return gameStore[gameId];
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void update(Guid gameId, Game game)
        {
            gameStore[gameId] = game;
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public string getUser(Guid gameId, Player userColor)
        {
            return userStore[(gameId, userColor)];
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void addUser(string userId, Guid gameId, Player player)
        {
            userStore[(gameId, player)] = userId;
            userToGameIdStore[userId] = (gameId, player);
        }

        public (Guid, Player) getGameId(string userId)
        {
            return userToGameIdStore[userId];
        }

    }
}
