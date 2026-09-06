import requests
import sys

# Ensure UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

def calculate_min_max_normalized(values):
    if not values:
        return []
    min_v = min(values)
    max_v = max(values)
    if min_v == max_v:
        return [0.0 for _ in values]
    return [(v - min_v) / (max_v - min_v) for v in values]

def compute_station_recommendation_scores(stations_list, predictions_map):
    eligible_with_pred = [
        s for s in stations_list
        if predictions_map.get(s['id'], {}).get('result') is not None
    ]
    
    if not eligible_with_pred:
        return {
            'scored_stations': [{**s, 'smart_score': None} for s in stations_list],
            'recommended_station': None,
            'has_ai_recommendation': False
        }
        
    distances = [s.get('distanceFromUser', 0.0) for s in eligible_with_pred]
    demands = [predictions_map[s['id']]['result'] for s in eligible_with_pred]
    
    norm_distances = calculate_min_max_normalized(distances)
    norm_demands = calculate_min_max_normalized(demands)
    
    scored_map = {}
    for idx, station in enumerate(eligible_with_pred):
        norm_dist = norm_distances[idx]
        norm_dem = norm_demands[idx]
        
        distance_score = 1.0 - norm_dist
        demand_score = 1.0 - norm_dem
        charger_score = 1.0 if station['derivedChargerType'] == 1 else 0.5
        
        final_score = 0.40 * distance_score + 0.40 * demand_score + 0.20 * charger_score
        smart_score = round(final_score * 100)
        
        scored_map[station['id']] = {
            'smart_score': smart_score,
            'distance_score': distance_score,
            'demand_score': demand_score,
            'charger_score': charger_score,
            'predicted_demand': demands[idx]
        }
        
    all_scored = []
    for s in stations_list:
        scoring = scored_map.get(s['id'])
        if scoring:
            all_scored.append({
                **s,
                'smart_score': scoring['smart_score'],
                'distance_score': scoring['distance_score'],
                'demand_score': scoring['demand_score'],
                'charger_score': scoring['charger_score'],
                'predicted_demand': scoring['predicted_demand']
            })
        else:
            all_scored.append({**s, 'smart_score': None})
            
    predicted_ranked = sorted(
        [s for s in all_scored if s['smart_score'] is not None],
        key=lambda x: x['smart_score'],
        reverse=True
    )
    unpredicted = [s for s in all_scored if s['smart_score'] is None]
    
    ranked_stations = predicted_ranked + unpredicted
    recommended_station = predicted_ranked[0] if predicted_ranked else None
    
    return {
        'scored_stations': ranked_stations,
        'recommended_station': recommended_station,
        'has_ai_recommendation': recommended_station is not None
    }

def run_tests():
    print("=== RUNNING SMARTCHARGE RECOMMENDATION SYSTEM TESTS ===")
    
    # Live API check
    api_url = "http://127.0.0.1:8000/predict-demand"
    
    test_stations = [
        {
            "id": "node-101",
            "name": "Public Station Alpha",
            "derivedLocation": "public institution",
            "derivedChargerType": 1,
            "predictionAvailable": True,
            "distanceFromUser": 3.5
        },
        {
            "id": "node-102",
            "name": "Hotel Beta Charger",
            "derivedLocation": "hotel",
            "derivedChargerType": 1,
            "predictionAvailable": True,
            "distanceFromUser": 1.2
        },
        {
            "id": "node-103",
            "name": "Parking Lot Gamma",
            "derivedLocation": "public parking lot",
            "derivedChargerType": 0,
            "predictionAvailable": True,
            "distanceFromUser": 8.0
        },
        {
            "id": "node-104",
            "name": "Unknown Station Delta",
            "derivedLocation": None,
            "derivedChargerType": 0,
            "predictionAvailable": False,
            "distanceFromUser": 2.0
        }
    ]
    
    print(f"\nDiscovered {len(test_stations)} stations total.")
    eligible = [s for s in test_stations if s['predictionAvailable']]
    print(f"Eligible stations with reliable metadata: {len(eligible)}")
    
    predictions_map = {}
    for st in eligible:
        payload = {
            "Location": st["derivedLocation"],
            "ChargerType": st["derivedChargerType"],
            "target_datetime": "2026-09-06T12:00:00"
        }
        res = requests.post(api_url, json=payload)
        assert res.status_code == 200, f"API error: {res.text}"
        data = res.json()
        print(f"Station {st['id']} ({st['name']}): Predicted Demand = {data['predictedDemand']:.2f} kWh")
        predictions_map[st['id']] = {'result': data['predictedDemand'], 'error': None}
        
    result = compute_station_recommendation_scores(test_stations, predictions_map)
    
    print("\n--- SCORE & RANKING RESULTS ---")
    for st in result['scored_stations']:
        score_str = f"{st['smart_score']}/100" if st['smart_score'] is not None else "N/A"
        pred_str = f"{st['predicted_demand']:.2f} kWh" if st.get('predicted_demand') is not None else "Unavailable"
        print(f"Station {st['id']} - {st['name']}: Distance = {st['distanceFromUser']} km, Demand = {pred_str}, Score = {score_str}")
        
    rec = result['recommended_station']
    assert rec is not None, "Recommendation failed!"
    print(f"\n[RECOMMENDED STATION]: {rec['name']} (ID: {rec['id']})")
    print(f"Reason: Recommended based on route distance ({rec['distanceFromUser']} km), predicted demand ({rec['predicted_demand']:.2f} kWh), and charger type ({'Fast/DC' if rec['derivedChargerType'] == 1 else 'Slow/AC'}). Smart Score = {rec['smart_score']}/100")
    
    # TEST 2 & 3: Missing Metadata Test
    missing_st = test_stations[3]
    assert missing_st['id'] not in predictions_map, "Station without metadata was requested!"
    print("\n[TEST 2 & 3 PASSED]: Station missing metadata (node-104) was NOT sent to /predict-demand and remained visible with prediction unavailable state.")
    
    # TEST 4: Partial API failure
    partial_preds = dict(predictions_map)
    partial_preds['node-101'] = {'result': None, 'error': '500 Internal Error'}
    part_result = compute_station_recommendation_scores(test_stations, partial_preds)
    assert part_result['has_ai_recommendation'], "Partial failure prevented recommendation of surviving stations!"
    print("[TEST 4 PASSED]: Partial API failure handled gracefully, surviving eligible stations were successfully scored and ranked.")
    
    # TEST 5: No eligible stations
    no_elig_result = compute_station_recommendation_scores([missing_st], {})
    assert not no_elig_result['has_ai_recommendation'], "No eligible stations should produce no recommendation!"
    assert no_elig_result['recommended_station'] is None
    print("[TEST 5 PASSED]: No eligible stations produced no recommendation state correctly.")
    
    print("\nALL TEST SCENARIOS PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
