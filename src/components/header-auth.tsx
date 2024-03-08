'use client'

import Link from 'next/link';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Input,
    Button,
    Avatar,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@nextui-org/react';
import * as actions from '@/actions';
import { useSession } from 'next-auth/react';

export default function HeaderAuth() {
    const session = useSession();

    let authContent: React.ReactNode;

    if(session.status === 'loading') {
        authContent = <NavbarItem>
            <div className='animate-pulse w-20 h-8 bg-gray-200 rounded-md'></div>
        </NavbarItem>
    } else if(session.data?.user) {

        authContent = <Popover placement='left'>
            <PopoverTrigger>
                <Avatar src={session.data?.user.image || ''} />
            </PopoverTrigger>
            <PopoverContent>
                <div className='py-3'>
                    <form action={actions.signOut}>
                        <Button type="submit" variant="flat">Sign Out</Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>

    } else {
        authContent = <>
            <NavbarItem>
                <form action={actions.signIn}>
                    <Button type="submit" color="secondary" variant="bordered">Sign In</Button>
                </form>
            </NavbarItem>
            <NavbarItem>
                <form action={actions.signIn}>
                    <Button type="submit" color="primary" variant="flat">Sign Up</Button>
                </form>
            </NavbarItem>
        </>
    }

    return authContent;

}