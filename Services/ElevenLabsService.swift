//
//  ElevenLabsService.swift
//  PomodoroVoice
//

import Foundation
import AVFoundation

class ElevenLabsService: ObservableObject {
    private var audioPlayer: AVAudioPlayer?
    
    func synthesizeSpeech(text: String, voiceID: String, apiKey: String, volume: Double, completion: @escaping (Result<Data, Error>) -> Void) {
        guard !apiKey.isEmpty, !voiceID.isEmpty else {
            completion(.failure(NSError(domain: "ElevenLabsService", code: 1, userInfo: [NSLocalizedDescriptionKey: "API key or Voice ID is missing"])))
            return
        }
        
        let url = URL(string: "https://api.elevenlabs.io/v1/text-to-speech/\(voiceID)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue(apiKey, forHTTPHeaderField: "xi-api-key")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody: [String: Any] = [
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": [
                "stability": 0.5,
                "similarity_boost": 0.75
            ]
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: requestBody)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "ElevenLabsService", code: 2, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            completion(.success(data))
        }.resume()
    }
    
    func playAudio(data: Data, volume: Double) {
        do {
            audioPlayer = try AVAudioPlayer(data: data)
            audioPlayer?.volume = Float(volume)
            audioPlayer?.prepareToPlay()
            audioPlayer?.play()
        } catch {
            print("Error playing audio: \(error)")
        }
    }
    
    func stopAudio() {
        audioPlayer?.stop()
        audioPlayer = nil
    }
    
    func previewVoice(text: String, voiceID: String, apiKey: String, volume: Double) {
        synthesizeSpeech(text: text, voiceID: voiceID, apiKey: apiKey, volume: volume) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let data):
                    self?.playAudio(data: data, volume: volume)
                case .failure(let error):
                    print("Preview error: \(error)")
                }
            }
        }
    }
}

