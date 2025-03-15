    import { PrismaClient } from "@prisma/client";

    const prisma = new PrismaClient();

    async function main() {
    // Menambahkan user dengan tier "Free"
    const freeUser = await prisma.user.create({
        data: {
        email: "najwaafrizal@gmail.com", // Gunakan email yang valid dan unik
        name: "Afrizal", // Nama pengguna
        tier: "Free", // Set tier ke "Free"
        credits: "10", // Set credits default
        profileImage: "", // Opsional, gambar profil
        clerkId: "99"
        },
    });

    console.log("Akun Free berhasil dibuat:", freeUser);

    // Anda bisa menambahkan lebih banyak data user lainnya dengan cara yang sama jika diperlukan
    }

    main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
