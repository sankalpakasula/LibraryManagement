
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { KeySquare, Mail, User, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // If no user, redirect to login
            router.push('/login');
        }
        setLoading(false);
    }, [router]);
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };


    return (
        <div className="bg-background text-foreground font-body min-h-screen">
            <Navbar />
            <div className="container mx-auto flex items-center justify-center py-12 sm:py-24">
                <Card className="w-full max-w-md bg-card/80 border-primary/10">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl text-primary">My Account</CardTitle>
                        <CardDescription>Your personal account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {loading ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ) : user ? (
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-20 w-20 text-3xl">
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold">{user.name}</h2>
                                    <p className="text-sm text-muted-foreground">{user.role === 'admin' ? 'Administrator' : 'User'}</p>
                                </div>
                                <div className="w-full space-y-3 pt-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm font-medium">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <KeySquare className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm">User ID: {user.id}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">Please log in to view your account details.</p>
                        )}
                    </CardContent>
                     {user && (
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
