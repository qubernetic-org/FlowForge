// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

using System.Collections.Concurrent;

namespace FlowForge.MonitorServer.Services;

public class SubscriptionManager
{
    private readonly ConcurrentDictionary<string, HashSet<string>> _subscriptionsByConnection = new();

    public void AddSubscription(string connectionId, string variablePath)
    {
        var paths = _subscriptionsByConnection.GetOrAdd(connectionId, _ => []);
        lock (paths) { paths.Add(variablePath); }
    }

    public void RemoveSubscription(string connectionId, string variablePath)
    {
        if (_subscriptionsByConnection.TryGetValue(connectionId, out var paths))
        {
            lock (paths) { paths.Remove(variablePath); }
        }
    }

    public IReadOnlySet<string> GetSubscriptions(string connectionId)
    {
        if (_subscriptionsByConnection.TryGetValue(connectionId, out var paths))
        {
            lock (paths) { return paths.ToHashSet(); }
        }
        return new HashSet<string>();
    }

    public void RemoveAllSubscriptions(string connectionId)
    {
        _subscriptionsByConnection.TryRemove(connectionId, out _);
    }
}
