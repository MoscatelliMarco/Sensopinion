export function isEquivalent(a, b) {
    // Get the keys of both objects
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();

    // Check if both have the same number of keys
    if (aKeys.length !== bKeys.length) {
        return false;
    }

    // Check if all keys and values are the same
    for (var i = 0; i < aKeys.length; i++) {
        var key = aKeys[i];
        if (key !== bKeys[i] || a[key] !== b[key]) {
            return false;
        }
    }

    // If all checks passed, objects are considered equivalent
    return true;
}