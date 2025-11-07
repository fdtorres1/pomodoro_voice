//
//  VoiceAlert.swift
//  PomodoroVoice
//

import Foundation

enum AlertTrigger: String, Codable, CaseIterable {
    case endOfSession = "End of Session"
    case startOfBreak = "Start of Break"
    case minutesBefore = "Minutes Before End"
    
    var displayName: String {
        return rawValue
    }
}

struct VoiceAlert: Codable, Identifiable {
    var id: UUID
    var trigger: AlertTrigger
    var minutesBefore: Int? // Only used when trigger is .minutesBefore
    var message: String
    var enabled: Bool
    
    init(id: UUID = UUID(), trigger: AlertTrigger = .endOfSession, minutesBefore: Int? = nil, message: String = "", enabled: Bool = true) {
        self.id = id
        self.trigger = trigger
        self.minutesBefore = minutesBefore
        self.message = message
        self.enabled = enabled
    }
    
    func shouldTrigger(currentSeconds: Int, totalSeconds: Int, phase: PomodoroPhase, isTransitioning: Bool) -> Bool {
        guard enabled else { return false }
        
        switch trigger {
        case .endOfSession:
            return currentSeconds == 0
        case .startOfBreak:
            return isTransitioning && phase != .focus
        case .minutesBefore:
            guard let minutesBefore = minutesBefore else { return false }
            let targetSeconds = minutesBefore * 60
            return currentSeconds == targetSeconds && currentSeconds > 0
        }
    }
}

struct VoiceAlertConfiguration: Codable {
    var focusAlerts: [VoiceAlert]
    var breakAlerts: [VoiceAlert]
    
    init() {
        self.focusAlerts = []
        self.breakAlerts = []
    }
    
    mutating func addFocusAlert() {
        guard focusAlerts.count < 10 else { return }
        focusAlerts.append(VoiceAlert())
    }
    
    mutating func removeFocusAlert(at index: Int) {
        guard index < focusAlerts.count else { return }
        focusAlerts.remove(at: index)
    }
    
    mutating func addBreakAlert() {
        guard breakAlerts.count < 10 else { return }
        breakAlerts.append(VoiceAlert())
    }
    
    mutating func removeBreakAlert(at index: Int) {
        guard index < breakAlerts.count else { return }
        breakAlerts.remove(at: index)
    }
}

