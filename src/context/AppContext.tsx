import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Case, 
  Institution, 
  OverlapGroup, 
  Alert, 
  AuditLogEntry, 
  BureauCode, 
  Status, 
  ActionType 
} from '../types';
import { 
  mockUsers, 
  mockCases, 
  mockInstitutions, 
  mockOverlapGroups, 
  mockAlerts, 
  mockAuditLogs 
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  cases: Case[];
  institutions: Institution[];
  overlapGroups: OverlapGroup[];
  alerts: Alert[];
  auditLogs: AuditLogEntry[];
  addCaseAction: (
    caseId: string, 
    action: { 
      actionType: ActionType; 
      remarks: string; 
      toBureau?: BureauCode; 
      statusAfter?: Status;
    }
  ) => void;
  updateCaseStatus: (caseId: string, newStatus: Status, remarks: string) => void;
  transferCase: (caseId: string, toBureau: BureauCode, remarks: string) => void;
  escalateCase: (caseId: string, remarks: string) => void;
  linkCase: (caseId: string, targetCaseId: string) => void;
  confirmOverlap: (groupId: string, note?: string) => void;
  dismissOverlap: (groupId: string, note?: string) => void;
  requestCoordination: (groupId: string, note: string) => void;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('aicte_current_user');
    return saved ? JSON.parse(saved) : mockUsers[0];
  });

  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem('aicte_cases');
    return saved ? JSON.parse(saved) : mockCases;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('aicte_institutions');
    return saved ? JSON.parse(saved) : mockInstitutions;
  });

  const [overlapGroups, setOverlapGroups] = useState<OverlapGroup[]>(() => {
    const saved = localStorage.getItem('aicte_overlaps');
    return saved ? JSON.parse(saved) : mockOverlapGroups;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('aicte_alerts');
    return saved ? JSON.parse(saved) : mockAlerts;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('aicte_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aicte_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aicte_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('aicte_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('aicte_overlaps', JSON.stringify(overlapGroups));
  }, [overlapGroups]);

  useEffect(() => {
    localStorage.setItem('aicte_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('aicte_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAudit = (entity: string, entityId: string, action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      entity,
      entityId,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: '10.24.50.11'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addCaseAction = (
    caseId: string, 
    action: { 
      actionType: ActionType; 
      remarks: string; 
      toBureau?: BureauCode; 
      statusAfter?: Status;
    }
  ) => {
    setCases(prevCases => prevCases.map(c => {
      if (c.id !== caseId) return c;

      const newAction = {
        id: `act-${Date.now()}`,
        actionType: action.actionType,
        fromBureau: c.currentBureau,
        toBureau: action.toBureau || c.currentBureau,
        performedBy: currentUser.id,
        performedByName: currentUser.name,
        performedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        remarks: action.remarks,
        statusAfter: action.statusAfter || c.status
      };

      const updatedStatus = action.statusAfter || c.status;
      const updatedBureau = action.toBureau || c.currentBureau;

      return {
        ...c,
        status: updatedStatus,
        currentBureau: updatedBureau,
        lastActionOn: new Date().toISOString().split('T')[0],
        lastActionSummary: action.remarks,
        actions: [newAction, ...c.actions]
      };
    }));

    logAudit('Case', caseId, action.actionType, action.remarks);
  };

  const updateCaseStatus = (caseId: string, newStatus: Status, remarks: string) => {
    addCaseAction(caseId, {
      actionType: newStatus === 'DISPOSED' ? 'DISPOSAL' : 'STATUS_CHANGE',
      remarks,
      statusAfter: newStatus
    });
  };

  const transferCase = (caseId: string, toBureau: BureauCode, remarks: string) => {
    addCaseAction(caseId, {
      actionType: 'TRANSFER',
      toBureau,
      remarks: `Transferred to ${toBureau}: ${remarks}`,
      statusAfter: 'TRANSFERRED'
    });
  };

  const escalateCase = (caseId: string, remarks: string) => {
    addCaseAction(caseId, {
      actionType: 'ESCALATION',
      remarks: `Escalated to Senior Authority: ${remarks}`,
      statusAfter: 'ESCALATED'
    });
  };

  const linkCase = (caseId: string, targetCaseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId && !c.linkedCaseIds.includes(targetCaseId)) {
        return { ...c, linkedCaseIds: [...c.linkedCaseIds, targetCaseId] };
      }
      if (c.id === targetCaseId && !c.linkedCaseIds.includes(caseId)) {
        return { ...c, linkedCaseIds: [...c.linkedCaseIds, caseId] };
      }
      return c;
    }));
    logAudit('Case', caseId, 'LINK', `Linked case with ${targetCaseId}`);
  };

  const confirmOverlap = (groupId: string, note?: string) => {
    setOverlapGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        state: 'CONFIRMED',
        reviewedBy: currentUser.name,
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        coordinationNote: note || g.coordinationNote
      };
    }));
    logAudit('OverlapGroup', groupId, 'CONFIRM_LINK', note || 'Confirmed cross-bureau overlap');
  };

  const dismissOverlap = (groupId: string, note?: string) => {
    setOverlapGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        state: 'DISMISSED',
        reviewedBy: currentUser.name,
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        coordinationNote: note || g.coordinationNote
      };
    }));
    logAudit('OverlapGroup', groupId, 'DISMISS', note || 'Dismissed overlap suggestion');
  };

  const requestCoordination = (groupId: string, note: string) => {
    setOverlapGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        state: 'CONFIRMED',
        coordinationNote: note,
        reviewedBy: currentUser.name,
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
    }));

    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      type: 'OVERLAP',
      message: `Coordination requested for Group ${groupId}: ${note}`,
      severity: 'warning',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAlerts(prev => [newAlert, ...prev]);
    logAudit('OverlapGroup', groupId, 'REQUEST_COORDINATION', note);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
  };

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setCases(mockCases);
    setInstitutions(mockInstitutions);
    setOverlapGroups(mockOverlapGroups);
    setAlerts(mockAlerts);
    setAuditLogs(mockAuditLogs);
    setCurrentUser(mockUsers[0]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      users: mockUsers,
      cases,
      institutions,
      overlapGroups,
      alerts,
      auditLogs,
      addCaseAction,
      updateCaseStatus,
      transferCase,
      escalateCase,
      linkCase,
      confirmOverlap,
      dismissOverlap,
      requestCoordination,
      markAlertAsRead,
      markAllAlertsAsRead,
      resetToDefaultData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

