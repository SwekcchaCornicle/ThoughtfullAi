# def find_duplicate_files(s3_objects):
#     """
#     s3_objects = [{'key': 'file1.txt', 'etag': 'abc123'}, ...]
#     Returns dict of etag -> list of keys that are duplicates
#     """
#     from collections import defaultdict
#     etag_map = defaultdict(list)
    
#     for obj in s3_objects:
#         etag_map[obj['etag']].append(obj['key'])
#     print(etag_map)
    
#     duplicates = {etag: keys for etag, keys in etag_map.items() if len(keys) > 1}
#     return duplicates

# objects = [
#     {'key': 'a/file.txt', 'etag': 'abc'},
#     {'key': 'b/file.txt', 'etag': 'abc'},  # duplicate
#     {'key': 'c/other.txt', 'etag': 'xyz'},
# ]
# find_duplicate_files(objects)
# # {'abc': ['a/file.txt', 'b/file.txt']}

from collections import defaultdict

def group_by_region(instances):
    result = defaultdict(list)
    for inst in instances:
        newd = {}
        newd["type"] = inst['type']
        newd["id"] = inst['id']
        result[inst['region']].append(newd)
    return dict(result)

instances = [
    {'id': 'i-001', 'region': 'us-east-1', 'type': 't3.micro'},
    {'id': 'i-002', 'region': 'ap-south-1', 'type': 't3.small'},
    {'id': 'i-003', 'region': 'us-east-1', 'type': 't3.large'},
]
print(group_by_region(instances))


