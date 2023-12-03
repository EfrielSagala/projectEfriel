<?php
header("Content-Type: application/json");

// Data konser (dapat disimpan di database)
$concerts = [
    ['id' => 1, 'artist' => 'Coldplay', 'date' => '2023-12-01', 'venue' => 'Stadium A'],
    ['id' => 2, 'artist' => 'Ed Sheeran', 'date' => '2023-11-15', 'venue' => 'Arena B'],
    ['id' => 3, 'artist' => 'Beyonce', 'date' => '2024-01-05', 'venue' => 'Hall C'],
];

// Handle HTTP GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($concerts);
}

// Handle HTTP POST request for ticket purchase
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Baca data JSON dari body request
    $data = json_decode(file_get_contents("php://input"), true);

    // Cek apakah konser tersedia
    $concertId = $data['concert_id'];
    $quantity = $data['quantity'];

    if (!isset($concerts[$concertId - 1])) {
        echo json_encode(['error' => 'Konser tidak ditemukan']);
    } else {
        // Lakukan pembelian tiket (di sini bisa diimplementasikan proses pembayaran)
        $totalPrice = $quantity * 50; // Harga tiket sederhana (contoh)
        
        // Kirim balasan JSON
        echo json_encode(['message' => 'Pembelian tiket berhasil', 'total_price' => $totalPrice]);
    }
}
?>
.
